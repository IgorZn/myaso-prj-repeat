const request = require("supertest");
const app = require("../src/app");
const { mongoConnect, mongoDisconnect } = require('../services/mongo')


describe('Test GET /planets', () => {
    beforeAll( async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });


    test('It should return 200 success', async () => {
        await request(app)
            .get('/planets')
            .expect('Content-Type', /json/)
            .expect(200);
    });

});