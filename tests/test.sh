sudo systemctl start mongodb
mongosh -f load-mock-db.js # be careful, deletes data
node populate-db.js
npm test
