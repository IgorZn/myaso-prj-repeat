const {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById } = require('../../models/launches.model');

const { getPagination } = require('../../../services/query')

async function httpGetAllLaunches(req, res){
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
};

async function httpAddNewLaunch(req, res) {
    // Convert date -req.body.launchDate- to Date() object from string
    const launch = Object.assign(req.body, {
        launchDate: new Date(req.body.launchDate)
    });

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    };

    let required = [
        launch.mission,
        launch.rocket,
        launch.launchDate,
        launch.target].every(elem => elem);

    if (!required) {
        required = [
            launch.mission,
            launch.rocket,
            launch.launchDate,
            launch.target
        ]
        console.log('Debugging required -->', required)
        return res.status(400).json({
            error: 'Missing required launch property'
        })
    };

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch)
};

async function httpAbortLaunch(req, res) {
    /*
    Req.params
    Это свойство представляет собой объект, содержащий свойства,
    сопоставленные «параметрам» именованного маршрута. Например,
    если у вас есть маршрут /user/:name, тогда свойство «имя»
    доступно как req.params.name.

    По умолчанию этот объект имеет значение {}.
    */

    const launchId = Number(req.params.id);
    const existLaunch = await existLaunchWithId(launchId);

    if (!existLaunch) {
        console.log('Launch not found')
        return res.status(404).json({
            error: 'Launch not found'
        });
    };

    const aborted = await abortLaunchById(launchId)

    if (!aborted.acknowledged) {
        return res.status(400).json({
            error: 'Launch not found'
        })
    }
    return res.status(200).json(aborted)
};

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};