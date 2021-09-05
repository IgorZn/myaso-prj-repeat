const { getAllLaunches } = require('../../models/launches.model')

function httpGetAllLaunches(req, res){
    console.log(req.body['test'])
    return res.status(200).json(getAllLaunches())
};

module.exports = {
    httpGetAllLaunches,
};