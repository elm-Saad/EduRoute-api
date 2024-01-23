const { BadRequestError } = require("../errors");


/**Restrict Test User only for auth Routes*/ 
const testUser = (req,res,next)=>{
    if(req.user.testUser){
        throw new BadRequestError('Test user. read only')
    }
    next()
}

module.exports = testUser