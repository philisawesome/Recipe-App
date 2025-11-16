db = connect("mongodb://localhost:27017/recipeDB");
db.users.deleteMany({})
db.users.insertMany([
	{
		username: 'Phil',
		email: 'phil@gmail.com'
	},
	{
		username: 'Albert',
		email: 'albert@gmail.com'
	}
])
