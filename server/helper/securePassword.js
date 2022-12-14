//bcrypt password start
const bcrypt = require('bcrypt')
const saltRounds = 10
//bcrypt password end

//receive plain (password)
exports.securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.log(error)
  }
}

//compare password (password and hash password from db)
exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}
