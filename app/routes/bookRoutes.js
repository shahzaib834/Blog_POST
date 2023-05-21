const express = require('express');
const {
  showAllBooks,
  showBookWithId,
  addBook,
  deleteBook,
  likeABook,
  reviewOnABook,
  showMyBooks
} = require('../controllers/bookController');

const {protect} = require('../middleware/authMiddleware');
const router = express.Router();

// Show My Books
router.route('/myBooks').get(protect, showMyBooks)

// All Books
router.route('/').get(showAllBooks);

// Show book by id
router.route('/:id').get(showBookWithId);

// Add A Book
router.route('/add').post(protect, addBook);

// Delete A Book
router.route('/delete/:id').delete(protect, deleteBook);

// Like a book
router.route('/like/:id').put(protect, likeABook);

//Review on a blog
router.route('/review/:id').post(protect, reviewOnABook);

module.exports = router;
