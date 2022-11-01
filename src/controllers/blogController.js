const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const userModel = require("../models/authorModel")
const BlogModel = require("../models/blogModel")
const auth = require("../middleware/auth.js")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


var title = /^[a-zA-Z\s\-\.\:\d]+$/i
var body = /^[a-zA-Z\s\-\,]+$/
var ObjectId = mongoose.Types.ObjectId.isValid


const createBlog = async function (req, res) {

    let data = req.body
    data.tags = data.tags.split(",");
    data.subcategory = data.subcategory.split(",");

    if (userverify != data.author_id) {
        return res.status(401).send({ status: false, message: "You are not Authorised User" })
    }

    if (!data.title) {
        return res.status(400).send({ status: false, message: "title is required" })
    } else if (!title.test(data.title)) {
        return res.status(400).send({ status: false, message: "title not correct" })
    }

    if (!data.body) {
        return res.status(400).send({ status: false, message: "body is required" })
    } else if (!body.test(data.body)) {
        return res.status(400).send({ status: false, message: "body not correct" })
    }

    if (!data.category) {
        return res.status(400).send({ status: false, message: "category is required" })
    } else if (!body.test(data.category)) {
        return res.status(400).send({ status: false, message: "category not correct" })
    }

    if (data.tags) {
        if (!body.test(data.tags)) {
            return res.status(400).send({ status: false, message: "tags not correct" })
        }
    }
    if (data.subcategory) {
        if (!body.test(data.subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory not correct" })
        }
    }

    if (!data.author_id) {
        return res.status(400).send({ status: false, message: "author_id is required" })
    } else if (!ObjectId(data.author_id)) {
        return res.status(400).send({ status: false, message: "author_id not correct" })
    } else {
        const userVerify = await userModel.findById(data.author_id)
        if (userVerify == null) return res.status(400).send({ status: false, message: "Author not found" })
        if (userVerify._id == data.author_id) {
            let savedData = await BlogModel.create(data)
            res.status(201).send({
                message
                    : "Blog succefully created", data: savedData
            })
        } else {
            res.status(400).send({ status: false, message: "User details not matched" })
        }
    }
}

const getAllBlogs = async function (req, res) {
    let data = req.query
    if (data.tags) {
        data.tags = { $regex: `${data.tags.toLowerCase()}` }
    }
    if (userverify != data.author_id) {
        return res.status(401).send({ status: false, message: "You are not Authorised User" })
    }

    try {
        if (Object.keys(data).length == 0) {
            let allBlogs = await BlogModel.find({ isDeleted: false } && { isPublished: true })

            if (allBlogs.length > 0) {
                return res.status(200).send({ message: "allBlogs", data: allBlogs })
            } else {
                return res.status(404).send({ status: false, message: "Blogs are not found" })
            }
        } else {
            let allBlogs = await BlogModel.find(data)
            if (allBlogs.length > 0) {
                return res.status(200).send({ message: "allBlogs", data: allBlogs })
            } else {
                return res.status(404).send({ status: false, message: "Blogs are not found" })
            }
        }
    } catch (err) {
        return res.status(404).send({ status: false, message: "Blogs are not found" })
    }
}




const updateBlog = async function (req, res) {
    let blogId = req.params.blogId
    let data = req.body
    let obj = {}

    if (Object.keys(data).length == 0) return res.status(400).send({
        status: false, message
            : "body cant be empty"
    })

    if (!ObjectId(blogId)) {
        return res.status(400).send({ status: false, message: "blog_id not correct" })
    }

    if (!title.test(data.title)) {
        return res.status(400).send({ status: false, message: "title not correct" })
    } else { obj.title = data.title }

    if (!body.test(data.body)) {
        return res.status(400).send({ status: false, message: "body not correct" })
    } else { obj.body = data.body }

    if (data.tags) {
        if (!body.test(data.tags)) {
            return res.status(400).send({ status: false, message: "tags not correct" })
        } else { obj.tags = data.tags.split(",") }
    }

    if (data.subcategory) {
        if (!body.test(data.subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory not correct" })
        } else { obj.subcategory = data.subcategory.split(",") }
    }
    if (data.isPublished) {
        obj.isPublished = true
        obj.PublishedAt = new Date().toISOString();
    }

    const filter = { _id: blogId, isDeleted: false };
    let check = await BlogModel.findOne(filter);

    if (!check) return res.status(400).send({
        status: false, message
            : "Blog is not found"
    })

    if (userId == check.author_id.toString()) {
        let doc = await BlogModel.findOneAndUpdate(filter, obj, { new: true });
        console.log(userId);
        if (doc == null) {
            res.status(404).send({ status: false, message: "Blog is not found" })
        } else {
            res.status(200).send({ message: "Blog Update Successfully", data: doc })
        }
    } else {
        return res.status(400).send({ status: false, message: "you are not" })
    }
}



const deleteBlogById = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!ObjectId(blogId)) {
            return res.status(400).send({ status: false, message: "Incorrect Blog_id" })
        }
        let check = await BlogModel.findById({ _id: blogId })
        if (check == null) {
            return res.status(400).send({ status: false, message: "Blog dosen't exist" })
        }
        if (userId != check.author_id.toString()) {
            return res.status(400).send({ status: false, message: "You are not authorised" })
        }

        if (check.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Blog is alredy deleted" })
        }

        let deletedTime = new Date().toISOString();
        let doc = await BlogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, isDeletedAt: deletedTime }, { new: true });
        return res.status(200).send({
            status: true, message
                : "Succefully deleted", data: doc
        })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const deleteBlogByQuery = async function (req, res) {
    try {
        const { author_id, category, tags, subcategory, isPublished } = req.query
        let obj = {}
        if (tags) {
            if (tags.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left The Tag query empty" })
            obj.tags = tags.trim().split(",").map(e => e.trim())
        }
        if (category) {
            if (category.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left The category query empty" })
            obj.category = category
        }
        if (author_id) {
            if (author_id.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left author_id Query Empty" })
            if (!mongoose.isValidObjectId(author_id)) return res.status(400).send({ status: false, message: "The Format of author_id is invalid" })
            let data = await authorModel.findById({ _id: author_id })
            if (!data) return res.status(400).send({ status: false, message: "The author_id is invalid" })
            obj.author_id = author_id
        }
        if (subcategory) {
            if (subcategory.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left subcategory Query Empty" })
            obj.subcategory = subcategory.trim().split(",").map(e => e.trim())
        }
        if (isPublished) {
            if (isPublished.trim().length == 0) return res.status(400).send({ status: false, message: "Dont Left isPublished Query Empty" })
            obj.isPublished = isPublished
        }

        let deletedTime = new Date().toISOString();
        let blogdata = await blogModel.findOne(obj)
        if (userId != blogdata.author_id.toString()) {
            return res.status(400).send({ status: false, message: "You are not authorised" })
        }
        if (!blogdata) return res.status(400).send({ status: false, message: "Book not available" })
        if (blogdata.isDeleted == true) return res.status(400).send({ status: false, message: "Blog is alredy deleted" })

        let data = await blogModel.findOneAndUpdate(obj, { "isDeleted": true, "isDeletedAt": deletedTime }, { new: true })
        return res.status(200).send({ status: true, message: "Blog is succesFully deleted", blog: data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteBlogByQuery = deleteBlogByQuery
