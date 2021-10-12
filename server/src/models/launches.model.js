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
    });
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
    console.log(
        launch.target
    );

    const planet = planets.findOne({
        keplerName: launch.target,
    });

    planet.then( async res => {
        if (!res) {
            throw new Error('No such planet in target list')
        } else {
            await launchesDB.updateOne({
                flightNumber: launch.flightNumber,
            }, launch , {
                upsert: true
            });
        };

    });



};

async function scheduleNewLaunch(launch) {
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

    const launchDocs = response.data.docs;
    launchDocs.forEach( doc => {
        /*
        *  Make a flat arr from nested arrs
        * */
        const payloads = doc['payloads'];
        const customers = payloads.flatMap( payload => {
            return payload['customers']
        });

        const launch = {
            flightNumber: doc['flight_number'],
            mission: doc['name'], // name
            rocket: doc['rocket']['name'], // rocket.name
            launchDate: doc['date_local'], // date_local
            // target: 'Kepler-442 b', // not applicable
            customers, // payloads.customers
            upcoming: doc['upcoming'], // upcoming
            success: doc['success'], // success
        }

        console.log(launch.flightNumber, launch.mission, launch.customers)

    //    TODO: populate launches collection...
    });
}

async function loadLaunchesData() {
    const first = findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (first) {
        console.log('Launch data already loaded...');
    } else {
        await populateLaunches();
    }
};

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
};

module.exports = {
    existLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    scheduleNewLaunch,
    launch,
    loadLaunchesData,
};