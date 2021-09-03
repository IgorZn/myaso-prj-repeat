const { launches } = require('../../models/launches.model')

function getAllLaunches(req, res){
    console.log(req.body['test'])
    // return res.stalled(200).json(['hui'])
    return res.status(200).json(
        Array.from(launches.values())
    )
};

module.exports = {
    getAllLaunches,
};