import request from 'supertest'
import { app, connectDatabase } from "../recipe-backend/app"
import mongoose from 'mongoose';

beforeAll(async () => {
	await connectDatabase()
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

	setUserId(user_id) {
		this.user_id = user_id 
		if (this.idresolver) {
			this.idresolver()
		}
	}

	async gotUserId() {
		if (this.user_id) return this.user_id

		await new Promise((resolve) => {
			this.idresolver = resolve
		})

		return this.user_id
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

describe('my profile and following', () => {
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
			expect(res.body.user._id).not.toBeNull();
			TM.setUserId(res.body.user._id)
			expect(res.body.user.email).toEqual('justy@justy.com')
			expect(res.body.user.name).toEqual('Justin')
			expect(res.body.user.username).toEqual('justin')
			expect(res.body.user.following).toHaveLength(0)
			expect(res.statusCode).toEqual(200)
		})
	})
});

describe('get profile', () => {
	it('profile/:id', async () => {
		let access_token = await TM.gotAccessToken();
		let user_id = await TM.gotUserId();

		await request(app)
		.get(`/api/profile/${user_id}`)
		.set('Authorization', 'Bearer ' + access_token)
		.expect(200)
		.then(res => {
			logerr(res)
		})
	})
});

describe('create post', () => {
	it('POST posts', async () => {
		let access_token = await TM.gotAccessToken();

		await request(app)
		.post(`/api/posts`)
		.set({
			'Authorization': 'Bearer ' + access_token,
		})
		.send({
			file: new File([""], "file", { type: 'image/png' }),
			title: "title",
		})
		.expect(201)
		.then(res => {
			logerr(res)
		})
	})
});
