const bodyParser = require('body-parser')
const express = require('express')
const { registerUser, login, userProfile } = require('../controllers/user')
const { registerUserValidator } = require('../validator/user')
//to use two local port i.e. frontend and server
const cors = require('cors')
//cookie parser
var cookieParser = require('cookie-parser')
const { isAuthorized } = require('../middlewares/tokenAut')

const userRoute = express()

//these aree middleware receiving json data
userRoute.use(bodyParser.json()) 
//receiving form data body it must be there
userRoute.use(bodyParser.urlencoded({ extended: true }))

//to use two local port i.e. frontend and server
userRoute.use(cors({
    origin: ' http://localhost:3000',
    credentials: true,

}))

//send token in cookie parser
userRoute.use(cookieParser())


//registerUserValidator check the error and if there is no error it moves to registerUser
userRoute.post('/register', registerUserValidator, registerUser)
//login

userRoute.post('/login', login)
userRoute.get('/profile', isAuthorized, userProfile)


module.exports = userRoute
