const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateEmail
} = require('../controllers/authenticationController');
const {
  showAllUsers,
  showUserWithId,
  updateUser,
  followUser,
} = require('../controllers/userController');
const {protect, authorizeRoles} = require('../middleware/authMiddleware');

const router = express.Router();

// Register An User
router.route('/register').post(registerUser);

//Login an User
router.route('/login').post(loginUser);

//Get User profile
router.route('/myProfile').get(protect, getUserProfile);

// Get All Users
router.route('/allUsers').get(protect,authorizeRoles(['Admin']), showAllUsers);

// Get User By id
// I guess it is same as get my profile
router.route('/:email').get(showUserWithId);

// Update User By Id
router.route('/update').put(protect, updateUser);

// Update Email
router.route('/changeEmail').put(protect, updateEmail)

//Follow Other Users.
router.route('/follow/:email').put(protect, followUser);

module.exports = router;
