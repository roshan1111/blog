//middle for verifying cookie
var jwt = require('jsonwebtoken')

const dev = require("../config")

const isAuthorized = (req, res, Next) => {
    try {
      if (!req.headers.cookie) {
        return res.status(404).send({
          message: 'no cookie found. You need to login',
        })
      }
      //spliting token from cookie inside header. in cookie there is id and token. id=token (we are spliting token and saving)
      const token = req.headers.cookie.split('=')[1]
      if (!token) {
        return res.status(404).send({
          message: 'no token found',
        })
      }
      //very the token
      jwt.verify(token, dev.app.jwtKey, function (err, decoded) {
        if (err) {
          console.log(err)
        }
        console.log(decoded)
        //setting decoded id as req.id 
        req.id = decoded.id
        Next()
      })
    } catch (error) {
      res.status(500).send({
        message: error.message,
      })
    }
  }
  
  module.exports = {isAuthorized}