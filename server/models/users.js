const { Schema, model } = require('mongoose')

//creating user  schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    minLength: [3, 'name must be of 3 character '],
    maxLength: [300, 'name must bot be of 300 character '],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minLength: [3, 'product must be of 3 character '],
  },
  phone: {
    type: String,
    required: [true, 'phone is required'],
    trim: true,
    minLength: [3, 'name must be of 3 character '],
    maxLength: [15, 'name must bot be of 300 character '],
  },
  isVerify: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Number,
    default: 0,
  },
})

const User = model('Users', userSchema)
module.exports = User
