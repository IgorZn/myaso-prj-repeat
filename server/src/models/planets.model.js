const parse = require('csv-parse');
const fs = require('fs');

const results = [];

fs.createReadStream('../server/Data/kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', (data) => {
        results.push(data);
    })
    .on('error', (err) => {
        console.error(err)
    })
    .on('end', () => {
        console.log(results);
        console.log('Done');
    })

const planets = [1,2];

module.exports = planets;