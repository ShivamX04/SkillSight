const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blackList.model')

async function authUser(req,res,next){

    const token = req.cookies.token

    if(!token){
      return res.status(401).json({
        message: "Token not provided"
      })
    }
    // checling if the token is blackedlisted //
    const isTokenBlackListed = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlackListed){
        return res.status(401).json({
            message: "Token is Invalid."
        })
    }

    try{
       const decoded = jwt.verify(token, process.env.JWT_SECRET)

       // data which we get from token is given to decoded //
       req.user = decoded

       next()

    }catch (err){
        return res.status(401).json({
            message: "Invalid token."
        })
    }
}

module.exports = {authUser}