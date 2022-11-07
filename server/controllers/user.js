const { errorResponse, sucessResponse } = require('../helper/responseHelper')
const { securePassword, comparePassword } = require('../helper/securePassword')
const User = require('../models/users')

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
    sucessResponse(res, 201, 'user created', userinfo)
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }
}


//login user
const login = async(req, res)=>{
    try{
      const {  email, password } = req.body
      if ( !email || !password ) {
        //calling function which bacially handlee error
        return errorResponse(
          res,
          400,
          'please provide  email, password '
        )
      }

      const userData = await User.findOne({email:email})
      if(userData){
        const isMatched = await comparePassword(password, userData.password);
        if(isMatched){
          //sending custom data
    const userinfo = {
      id: userData._id,
      name: userData.name,
      email: userData.email,

  }
          return sucessResponse(res, 200, "user login", userinfo)
        }else{
          return errorResponse(res,404,"invalid email and password")
         
        }
      }else{
        return errorResponse(res,404,"user with email and password doesnt exist")

      }


    }
    catch(error){
        res.status(500).send({
            message: error.message
        })
    }
}




module.exports = { registerUser,login }
