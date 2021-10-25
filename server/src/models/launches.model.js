const axios = require('axios')

const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';


const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-442 b', // not applicable
    customer: ['ZTM', 'NASA'], // payloads.customers
    upcoming: true, // upcoming
    success: true, // success
};

saveLaunch(launch);

async function existLaunchWithId(id) {
    // id -- flightNumber
    return launchesDB.findOne({
        flightNumber: Number(id)
    });
};

async function abortLaunchById(id) {
    return launchesDB.updateOne({
        flightNumber: id
    }, {
        success: false,
        upcoming: false,
    });
};

async function getAllLaunches() {
    return launchesDB.find({}, {
        '_id': 0,
        '__v': 0,
    })
        .sort('flightNumber');
};

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
};

async function saveLaunch(launch) {
    // Validation target planet
    const planet = planets.findOne({
        keplerName: launch.target,
    });
    planet.then( async result => {
        console.log('launch.target -->', launch.target);
        await launchesDB.updateOne({
            flightNumber: launch.flightNumber,
        }, launch , {
            upsert: true
        });

    });
};

async function scheduleNewLaunch(launch) {
    const planet = planets.findOne({
        keplerName: launch.target,
    });

    planet.then( async result => {
        if (!result) {
            console.log('No such planet in target list')
        }
    });

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
    })

    await saveLaunch(newLaunch);
};

async function populateLaunches() {
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_API_URL, {
      'options': {
        'pagination': false,
        'populate': [
          {
            'path': 'rocket',
            'select': {
              'name': 1
            }
          },
            {
            "path": "payloads",
            "select": {
              "customers": 1
            }
          }
        ]
      }
    });

    if (response.status !== 200) {
        console.error('Problem downloading launch data...')
    }
    const launchDocs = response.data.docs;
    /*
    *  Make a flat arr from nested arrs
    * */

    launchDocs.map( async function (launchDoc) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap( payload => {
            return payload['customers']
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'], // name
            rocket: launchDoc['rocket']['name'], // rocket.name
            launchDate: launchDoc['date_local'], // date_local
            // target: 'Kepler-442 b', // not applicable
            upcoming: launchDoc['upcoming'], // upcoming
            success: launchDoc['success'], // success
            customers, // payloads.customers
        }

        console.log(launch.flightNumber, launch.mission, launch.customers)
        await saveLaunch(launch)
    })
}

async function loadLaunchesData() {
    const first = findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    first.then( async result => {
        if (result) {
            console.log('first -> result', result)
            console.log('Launch data already loaded...');
        } else {
            await populateLaunches();
        }
    })



};

async function findLaunch(filter) {
    return launchesDB.findOne(filter);
};

module.exports = {
    existLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    scheduleNewLaunch,
    launch,
    loadLaunchesData,
};