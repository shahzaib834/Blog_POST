const express = require('express');
const {
  showAllBlogs,
  showBlogWithId,
  addBlog,
  updateBlog,
  deleteBlog,
  likeABlog,
  commentOnABlog,
  showMyBlogs,
} = require('../Controllers/BlogPostController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Show My Blogs
router.route('/myBlogs').get(protect, showMyBlogs);

// All Blogs.
router.route('/allBlogs').get(showAllBlogs);

// Show blogs by id
router.route('/:id').get(showBlogWithId);

// Add A Blog
router.route('/add').post(protect, addBlog);

// Update A Blog
router.route('/update/:id').put(protect, updateBlog);

// Delete A Blog
router.route('/delete/:id').delete(protect, deleteBlog);

// Like a blog
router.route('/like/:id').put(protect, likeABlog);

//Comment on a blog
router.route('/comment/:id').post(protect, commentOnABlog);

module.exports = router;
