const {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById } = require('../../models/launches.model')

function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches().sort((a, b) => {
        return a.flightNumber - b.flightNumber
    }))
};

function httpAddNewLaunch(req, res) {
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
        return res.status(400).json({
            error: 'Missing required launch property'
        })
    };

    addNewLaunch(launch);
    return res.status(201).json(launch)
};

function httpAbortLaunch(req, res) {
    /*
    Req.params
    Это свойство представляет собой объект, содержащий свойства,
    сопоставленные «параметрам» именованного маршрута. Например,
    если у вас есть маршрут /user/:name, тогда свойство «имя»
    доступно как req.params.name.

    По умолчанию этот объект имеет значение {}.
    */

    const launchId = Number(req.params.id);
    if (!existLaunchWithId(launchId)) {
        console.log('Launch not found')
        return res.status(404).json({
            error: 'Launch not found'
        });
    };

    const aborted = abortLaunchById(launchId)
    return res.status(200).json(aborted)
};

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};