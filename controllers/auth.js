const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError,UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')

const register = async (req,res)=>{

  // const {name,email,password} = req.body
  // if(!name|!email||!password){
  //   throw new BadRequestError('please provide all data')
  // }

  /** OR */

  // error of the req.body => handled by DB => handled by error-handler  if (err.name === 'ValidationError')
  const user = await User.create({...req.body})


  // create the token
  // const token = jwt.sign({userID:user._id,name:user.name},"jwtSecret",{expiresIn:'30d'})

  // from module 
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user:{name:user.name,email:user.email},token})

}

const login = async (req,res)=>{
  const {email,password} = req.body

  // handle Credentials
  if(!email||!password){
    throw new BadRequestError('please provide email and password')
  }

  // Check for the user in the DB
  const user =  await User.findOne({email})


  if(!user){
    throw new UnauthenticatedError('Invalid Credentials')
  }

  //compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid Credentials')
  }


  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user:{name:user.name,email:user.email},token})
}

module.exports = {register,login}