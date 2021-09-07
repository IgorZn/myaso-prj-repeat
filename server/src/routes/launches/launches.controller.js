const { getAllLaunches, addNewLaunch } = require('../../models/launches.model')

function httpGetAllLaunches(req, res){
    console.log(req.body['test'])
    return res.status(200).json(getAllLaunches())
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

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
};