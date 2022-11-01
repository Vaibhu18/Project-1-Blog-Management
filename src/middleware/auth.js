const jwt = require("jsonwebtoken")
const BlogModel = require('../models/blogModel')
const mongoose = require('mongoose')



const authentication = function (req, res, next) {

    try {
        let token = req.headers["authorization"]
        token = token.split(" ").pop()
        if (!token) return res.status(400).send({ msg: "token must be present" });
        let decodedToken = jwt.verify(token, "Vaibhav Shinde")
        userverify = decodedToken.userId
        if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })
        next()

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


const authorization = async function (req, res, next) {
    try {
        // console.log(req.params.blogId);
        let token = req.headers["authorization"]
        token = token.split(" ").pop()
        if (!token) return res.status(400).send({ msg: "token must be present" });
        
        let decodedToken = jwt.verify(token, "Vaibhav Shinde")
        

        if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })

          userId = decodedToken.userId
             
         // let data = req.query; 

        // if (data.authorId) {
        //     if (!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "Enter a Valid authorId" })
        //     if (data.authorId != userId) return res.send({ status: false, msg: "you are not authorized" })
        // } 
        next()
    } catch (error) {

        res.status(500).send(error.message)
        
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization
 