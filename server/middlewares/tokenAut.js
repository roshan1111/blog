//middle for verifying cookie
var jwt = require('jsonwebtoken')

const dev = require('../config')

const isAuthorized = (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.status(404).send({
        message: 'No cookie found',
      })
    }

    const token = req.headers.cookie.split('=')[1]
    console.log('isAuthorized token: ', token)

    if (!token) {
      return res.status(404).send({
        message: 'No token found',
      })
    }
    // verify the token
    jwt.verify(String(token), String(dev.app.jwtKey), function (err, user) {
      if (err) {
        return res.status(403).json({
          message: 'Invalid token',
        })
      }

      // set the id in request
      req.id = user.id
      next()
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }
}

const getRefreshToken = async (req, res, Next) => {
  try {
    console.log('ref o')
    if (!req.headers.cookie) {
      return res.status(404).send({
        message: 'no cookie found. You need to for refreshing login',
      })
    }
    console.log('ref 1')
    //spliting token from cookie inside header. in cookie there is id and token. id=token (we are spliting token and saving)
    const oldToken = req.headers.cookie.split("=")[1];
    if (!oldToken) {
      return res.status(404).send({
        message: 'no token found',
      })
    }
    //very the old token
    jwt.verify(oldToken, String(dev.app.jwtKey), function (err, decoded) {
      if (err) {
        console.log(err)
        return res.status(403).send({
          message: 'could not verify old token',
        })
      }
      //if token is verfified we are reseting cookie as empty in the response and request
     req.cookies[`${decoded.id}`] = "";
     res.clearCookie(`${decoded.id}`);

      //generate new token
      const newToken = jwt.sign({ id:decoded.id }, String(dev.app.jwtKey), {
        //  algorithm: 'RS256',
        expiresIn: '36s',
      })
      console.log('ref token:', newToken)
      //send token inside cookie: first is name of the cookie and what we want to send value:token
      res.cookie(String(decoded.id), newToken, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 34),
        httpOnly: true,
      })
      // setting decoded id as  a new token in req.id
      req.id = decoded.id
      Next()
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports = { isAuthorized, getRefreshToken }
