const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;


const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
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

module.exports = {
    existLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    scheduleNewLaunch,
    launch,
};