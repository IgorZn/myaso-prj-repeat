const launchesDB = require('./launches.mongo')

const launches = new Map();

let latestFlightNumber = 100;

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

function existLaunchWithId(id) {
    // id -- flightNumber
    return launches.has(Number(id));
};

function abortLaunchById(id) {
    const aborted = launches.get(id);
    aborted.success = false;
    aborted.upcoming = false;
    return aborted;
};

async function getAllLaunches() {
    return launchesDB.find({}, {
        '_id': 0,
        '__v': 0,
    });
};

async function saveLaunch(launch) {
    await launchesDB.updateOne({
        flightNumber: launch.flightNumber,
    }, launch , {
        upsert: true
    })
};

function addNewLaunch(launch) {
    latestFlightNumber++;
    launch.flightNumber = latestFlightNumber;

    // console.log('addNewLaunch', launch.flightNumber)
    // console.log('addNewLaunch', launch)

    launches.set(launch.flightNumber, Object.assign(launch, {
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
    }))
};

module.exports = {
    existLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    addNewLaunch,
    launch,
};