// const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  // get clean token
  const token = authHeader.split(' ')[1]

  try {
    // verify user token 
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the Course routes
    //test user id
    const testUser = payload.userId === '65afaa541b092434b09b1d93'
    req.user = { userId: payload.userId, name: payload.name ,testUser}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
