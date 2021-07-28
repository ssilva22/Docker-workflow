
const express = require('express');
const { Router } = require('express');

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");


const router = express.Router();

//Get Post
router.route("/")
.get(protect,postController.getAllPosts)
.post( protect,postController.createPost)


//Update Post
router.route("/:id")
.get(protect,postController.getOnePost)
.patch(protect,postController.updatePost)
.delete(protect,postController.deletePost)

module.exports = router;