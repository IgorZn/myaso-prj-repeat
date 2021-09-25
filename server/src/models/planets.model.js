const fs = require('fs');
const path = require('path')
const parse = require('csv-parse');

const planets = require('./planets.mongo');

const dataFile = 'kepler_data.csv'


/*
const promise = new Promise( (resolve, reject) => {
    resolve(42)
})
promise.then((result) => {
    console.log(result) # will be 42

* */

const fullPath = path.join('..', 'server','Data', dataFile)

// console.log(__dirname)
// console.log(fullPath)

function loadPlanetsData() {
    return new Promise( (resolve, reject) => {
        fs.createReadStream(fullPath)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    await savePlanets(data)
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found.`);
                resolve('Done');
            });

    })

};

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.1
        && planet['koi_prad'] < 1.6;
}

async function getAllPlanets() {
    return planets.find({});
}

async function savePlanets(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        });
    } catch (e) {
        console.error(`Could not save planets: ${e}`)
    }
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
};