const jwt = require("jsonwebtoken");
const userModel = require("../models/authorModel")



var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var naming = /^([a-z]|[A-Z])+$/
var title = ["Mr", "Mrs", "Miss"]
var password = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


const createAuthor = async function (req, res) {
    let data = req.body

    if (!data.title) {
        return res.status(400).send({ status: false, message: "title is required" })
    } else if (!title.includes(data.title)) {
        return res.status(400).send({ status: false, message: "title not correct" })
    }

    if (!data.firstName) {
        return res.status(400).send({ status: false, message: "first name is required" })
    } else if (!naming.test(data.firstName)) {
        return res.status(400).send({ status: false, message: "first name not correct" })
    }

    if (!data.lastName) {
        return res.status(400).send({ status: false, message: "last name is required" })
    } else if (!naming.test(data.lastName)) {
        return res.status(400).send({ status: false, message: "last name not correct" })
    }

    if (!data.emailId) {
        return res.status(400).send({ status: false, message: "emailId is required" })
    } else if (!filter.test(data.emailId)) {
        return res.status(400).send({ status: false, message: "please provide valid email" })
    } else {
        const checkEmail = await userModel.findOne({ emailId: data.emailId })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "EmailId already exists" })
        }
    }

    if (!data.password) {
        return res.status(400).send({ status: false, message: "password is required" })
    } else if (!password.test(data.password)) {
        return res.status(400).send({ status: false, message: "password should contain 1-Uppercase,1-symbol,and minimum 8 length" })
    }

    let savedData = await userModel.create(data)
    res.status(201).send({ status: true, message: "Author Created Successfully", data: savedData })
}



const Autorlogin = async function (req, res) {
    let data = req.body

    if (!data.emailId) {
        return res.status(400).send({ status: false, message: "emailId is required" })
    } else if (!filter.test(data.emailId)) {
        return res.status(400).send({ status: false, message: "please enter valid emailId" })
    }

    if (!data.password) {
        return res.status(400).send({ status: false, message: "password is required" })
    } else if (!password.test(data.password)) {
        return res.status(400).send({ status: false, message: "password should contain 1-Uppercase,1-symbol,and minimum 8 length" })
    }

    var user = await userModel.findOne({ emailId: data.emailId, password: data.password });
    if (!user) {
        return res.status(400).send({ status: false, msgmessage: "username or password are not match" });
    } else {
        var token = jwt.sign({
            userId: user._id.toString(),
            batch: "Radon",
            organisation: "FunctionUp",
        },
            "Vaibhav Shinde"
        );
    }
    res.setHeader("x-auth-token", token);
    res.status(200).send({ message: "successfully logged in", token: token });
}

module.exports.createAuthor = createAuthor
module.exports.Autorlogin = Autorlogin
