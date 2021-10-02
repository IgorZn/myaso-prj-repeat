const request = require("supertest");
const app = require("../src/app");
const { mongoConnect, mongoDisconnect } = require('../services/mongo')

const API_VER = '/v1'

describe('Test GET /planets', () => {
    beforeAll( async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await app.close()
        await mongoDisconnect();
    });


    test('It should return 200 success', async () => {
        await request(app)
            .get(`${API_VER}/planets`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

});