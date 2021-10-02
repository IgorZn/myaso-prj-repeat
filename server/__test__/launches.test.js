const request = require('supertest')
const app = require('../src/app')
const model = require('../src/models/launches.model')
const { mongoConnect, mongoDisconnect } = require('../services/mongo')

const query = {
            mission: 'ZTM+100500',
            rocket: 'ZTM Explorer 1',
            launchDate: new Date('December 27, 2030'),
            target: 'Kepler-1410 b'
        };
const API_VER = '/v1'

describe('Launches API', () => {
    beforeAll( async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    })

    describe('Test GET /launches', () => {

    test('It should return 200 success', async () => {
        await request(app)
            .get(`${API_VER}/launches`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                model.launch.launchDate = model.launch.launchDate.toISOString();
                expect(res.body).toHaveProperty([model.launch]);
            });
    });

});

    describe('Test POST /launch', () => {

        test('It should respond with 200 success', async () => {
            await request(app)
                .post(`${API_VER}/launches`)
                .send(query)
                .expect('Content-Type', /json/)
                .expect(201)
                .then((res) => {
                    expect(res.body).toHaveProperty('upcoming', true)
                    expect(res.body).toHaveProperty('success', true)
                })
        });

        test('It should catch missing required properties', async () => {

            query.mission = ''

            await request(app)
                .post(`${API_VER}/launches`)
                .send(query)
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toHaveProperty('error', 'Missing required launch property')
                })
        });

        test('It should catch invalid date', async () => {

            query.launchDate = 'not Date'

            await request(app)
                .post(`${API_VER}/launches`)
                .send(query)
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toHaveProperty('error', 'Invalid launch date')
                })
        });
    });

    describe('Test DELETE /launch/:id', () => {

        test('It should DELETE launch', async () => {
            await request(app)
                .delete(`${API_VER}/launches/100`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body).toHaveProperty('acknowledged', true)
                    expect(res.body).toHaveProperty('modifiedCount', 1)
                    expect(res.body).toHaveProperty('matchedCount', 1)
                })
        })
    });

});

