const { check, validationResult } = require('express-validator')

exports.registerUserValidator = [
  //send message if name is empty
  check('name').notEmpty().withMessage('name is missing'),
  check('email').normalizeEmail().isEmail().withMessage('not a valid email'),
  check('password').notEmpty().withMessage('password is missing'),
  check('phone').notEmpty().withMessage('phone is missing'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const validationErrors = {}
      const allErrors = errors.array()
      allErrors.forEach((error) => {
        validationErrors[error.param] = error.msg
      })
      return res.status(400).json({
        validationErrors,
      })
    }
    //if no error move to next i.e registerUser on user route
    return next()
  },
]
