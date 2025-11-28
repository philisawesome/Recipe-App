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

function logerr(res) {
	if (res.body.error) console.log("Error: ", res.body.error)
}

// For global variables (access_token) and synchronizing tests
class TestManager {
	access_token
	resolver

	setAccessToken(token) {
		this.access_token = token
		if (this.resolver) {
			this.resolver()
		}
	}

	async gotAccessToken() {
		if (this.access_token) return this.access_token

		await new Promise((resolve) => {
			this.resolver = resolve
		})

		return this.access_token
	}
}

const TM = new TestManager(); 

describe('GET /', () => {
  it('get/', async () => {
    await request(app).get('/').expect(200)
  });
});

describe('new account and logging in', () => {
	it('register/ success', async () => {
    	await request(app)
		.post('/api/auth/register')
	  	.send({
			username: "Justin",
			name: "Justin",
			email: "justy@justy.com",
			password: "Nuggets123!"
		})
		.then(res => {
			logerr(res)
			expect(res.statusCode).toEqual(201)
		})
	});

	it('login/ success and token', async () => {
    	await request(app)
		.post('/api/auth/login')
	  	.send({
			username: "Justin",
			password: "Nuggets123!"
		})
		.then(res => {
			logerr(res)
			expect(res.statusCode).toEqual(200)
			expect(res.body.access_token).toBeDefined()
			TM.setAccessToken(res.body.access_token)
		})
  	});
});

describe('user profile and following', () => {
	it('profile/me success and fail', async () => {
		await request(app)
		.get('/api/profile/me')
		.expect(401)

		let access_token = await TM.gotAccessToken();

		await request(app)
		.get('/api/profile/me')
		.set('Authorization', 'Bearer ' + access_token)
		.expect(200)
		.then(res => {
			logerr(res)
			expect(res.statusCode).toEqual(200)
		})
	})
});
