require("dotenv").config();

const config = {
  secret: process.env.SECRET,
  connectionString: process.env.MONGO_CONNECTION_STRING,
};

module.exports = config;
