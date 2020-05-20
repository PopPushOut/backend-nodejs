const MongoClient = require('mongodb').MongoClient;
const connectionString =
  'mongodb+srv://dummy:ngSckQNcQlcKYrvB@cluster0-koonn.mongodb.net/test?retryWrites=true&w=majority';
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('very-cool-db');
  })
  .catch((error) => console.error(error));
