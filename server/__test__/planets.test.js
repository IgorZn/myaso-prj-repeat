const request = require("supertest");
const app = require("../src/app");
describe('Test GET /planets', () => {

    test('It should return 200 success', async () => {
        await request(app)
            .get('/planets')
            .expect('Content-Type', /json/)
            .expect(200);
    });

});