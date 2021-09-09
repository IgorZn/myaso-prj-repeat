const request = require('supertest')
const app = require('../src/app')

describe('Test GET /launches', () => {
    const response = request(app).get('/launches')
    expect(response).toBe(200)
});

describe('Test POST /launch', () => {
    test('It should respond with 200 succes', () => {

    });

    test('It should catch missing required properties', () => {

    });

    test('It should catch invalid date', () => {

    })
});