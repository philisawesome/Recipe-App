db = connect("mongodb://localhost:27017/recipeDB");
db.posts.deleteMany({})
db.users.deleteMany({})
db.users.insertMany([
	{
		_id: ObjectId('69ee97c0b061cb488844ba89'),
		username: 'phil',
		email: 'phil@gmail.com'
	},
	{
		username: 'albert',
		password: 'Albert',
		email: 'albert@gmail.com'
	}
])
