sudo systemctl start mongodb
mongosh -f load-mock-db.js
npm test
