//configering .env
require('dotenv').config()

const dev = {
  app: {
    port: process.env.SERVER_PORT,
    jwtKey: process.env.JWT_PRIVATE_KEY
  },
  db: {
    //url for bd we are getting from .env
    url: process.env.DB_URL || '',
  },

}

module.exports = dev
