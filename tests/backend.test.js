const request = require('supertest')
const a = require("../recipe-backend/app")
const mongoose = require('mongoose');
const app = a.app

beforeAll(async () => {
	await a.connectDatabase()
})

afterAll(async () => {
  	await mongoose.connection.close()
})

describe('GET /', () => {
  it('get/', async () => {
    await request(app).get('/').expect(200)
  });
});
