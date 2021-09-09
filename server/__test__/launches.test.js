const request = require('supertest')
const app = require('../src/app')

describe('Test GET /launches', () => {

    test('It should return 200 success', async () => {
        await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });

});

describe('Test POST /launch', () => {

    test('It should respond with 200 success', async () => {
        const query = {
            mission: 'ZTM+100500',
            rocket: 'ZTM Explorer 1',
            launchDate: new Date('December 27, 2030'),
            target: 'Kepler-186 f'
        };

        await request(app)
            .post('/launches')
            .send(query)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((res) => {
                expect(res.body).toHaveProperty('upcoming', true)
                expect(res.body).toHaveProperty('success', true)
            })
    });

    test('It should catch missing required properties', async () => {
        const query = {
            rocket: 'ZTM Explorer 1',
            launchDate: new Date('December 27, 2030'),
            target: 'Kepler-186 f'
        };

        await request(app)
            .post('/launches')
            .send(query)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res.body).toHaveProperty('error', 'Missing required launch property')
            })
    });

    test('It should catch invalid date', async () => {
        const query = {
            mission: 'ZTM+100500',
            rocket: 'ZTM Explorer 1',
            launchDate: 'not Date',
            target: 'Kepler-186 f'
        };

        await request(app)
            .post('/launches')
            .send(query)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res.body).toHaveProperty('error', 'Invalid launch date')
            })
    })
});