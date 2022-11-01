const express = require('express');
const router = express.Router();
const middleWare = require('../middleware/auth')
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createAuthor", authorController.createAuthor)
router.post("/Autorlogin", authorController.Autorlogin)
router.post("/createBlog", middleWare.authentication, blogController.createBlog)  // middleWare.authentication,
router.get("/getAllBlogs", middleWare.authentication, blogController.getAllBlogs)  //  middleWare.authentication,
router.put("/blogs/:blogId", middleWare.authorization, blogController.updateBlog) // middleWare.authorization,
router.delete("/deleteBlogById/:blogId", middleWare.authorization, blogController.deleteBlogById)  // middleWare.authorization,


router.delete("/deleteBlogByQuery", middleWare.authorization, blogController.deleteBlogByQuery)


module.exports = router;    