const { errorResponse, sucessResponse } = require('../helper/responseHelper')
const { securePassword, comparePassword } = require('../helper/securePassword')
var jwt = require('jsonwebtoken')

const User = require('../models/users')
const dev = require('../config')

//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password || !phone) {
      //calling function which bacially handlee error
      return errorResponse(
        res,
        400,
        'please provide name, email, password and phone'
      )
    }
    if (password.length < 5) {
      return errorResponse(
        res,
        400,
        'please provide password more than 5 character'
      )
    }

    //checking if email exist or not first email is db and 2nd is from body
    const userData = await User.findOne({ email: email })
    if (userData) {
      return errorResponse(res, 400, 'user with email already exist')
    }

    //hashing the password
    const hashPassword = await securePassword(password)
    console.log(hashPassword)

    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword,
      phone: phone,
    })
    //save the user on db
    const user = await newUser.save()
    if (!user) {
      return errorResponse(res, 400, 'user not created')
    }
    //sending custom data
    const userinfo = {
      id: user._id,
      name: user.name,
    }
    //if everything is sucessfull send data
    sucessResponse(res, 201, 'user created')
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }
}

//login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      //calling function which bacially handlee error
      return errorResponse(res, 400, 'please provide  email, password ')
    }

    const userData = await User.findOne({ email: email })
    if (userData) {
      const isMatched = await comparePassword(password, userData.password)
      if (isMatched) {
        //sending custom data
        // const userinfo = {
        //   id: userData._id,
        //   name: userData.name,
        //   email: userData.email,
        // }

        //generate JWT
        const token = jwt.sign({ id: userData._id }, String(dev.app.jwtKey), {
          //  algorithm: 'RS256',
          expiresIn: '40s',
        })

        //send token inside cookie: first is name of the cookie and what we want to send value:token
        res.cookie(String(userData._id), token, {
          path: '/',
          expires: new Date(Date.now() + 1000 * 38),
          httpOnly: true,
          sameSite: 'lax',
        })

        return sucessResponse(res, 200, 'user login', token)
      } else {
        return errorResponse(res, 404, 'invalid email and password')
      }
    } else {
      return errorResponse(
        res,
        404,
        'user with email and password doesnt exist'
      )
    }
  } catch (error) {
    return res.status(404).send({
      message: 'error.message',
    })
  }
}

const userProfile = async (req, res) => {
  try {
    // console.log(req.headers.cookie)
    //matching _id from db and req.id which we get from middleware i.e. declared from decoded
    const user = await User.findOne({ _id: req.id }, { password: 0 })
    if (!user) {
      return res.status(404).send({
        message: 'no cookie found. You need to login',
      })
    }

    res.status(200).json({
      message: 'user info returned',
      user,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}

//logout user
const userLogout = async (req, res) => {
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

    //verify the cookie
    jwt.verify(token, dev.app.jwtKey, function (err, decoded) {
      if (err) {
        console.log(err)
      }
      console.log(decoded)
      res.clearCookie(`${decoded.id}`)
    })
     res.status(200).json({
      message: 'user is logged out',
    })
  

  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}

module.exports = { registerUser, login, userProfile, userLogout }
