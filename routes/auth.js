const express = require('express')
const router = express.Router()

const { register, login, UpdateUser } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication')
const testUser = require('../middleware/testUser')
const rateLimiter = require('express-rate-limit')

const ApiLimiter = rateLimiter({
    windowMs: 15*60*1000,// 15 min
    max:10,
    message:{
        msg:'Too many request from this Ip , please try again after 15 minutes'
    }
})

router.post('/register',ApiLimiter, register)
router.post('/login',ApiLimiter, login)

router.patch('/updateUser',authenticateUser,testUser,UpdateUser)


module.exports = router
