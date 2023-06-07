const generateWebToken = require('../config/generateWebToken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { genSalt } = require('bcrypt');
const { prisma } = require('../config/db');

dotenv.config();

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validating user Input
    if (!email || !password) {
      return res.status(400).send(`Please send all required fields`);
    }

    // Checking if user already exists
    const UserExists = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (UserExists) {
      return res.status(400).send(`User already exists. Please Login`);
    }

    //Generating token for User
    const token = generateWebToken(email);

    // hashing password before saving to database
    let hashedPassword;
    const salt = await genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    // Creating User in database
    const name = 'GuestUser';
    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        token,
      },
    });

    // Saving token into cookie
    const options = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    // Return new User
    res.status(201).cookie('token', token, options).json({
      message: 'User Created successfully',
      user,
      token,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validating user input
    if (!email || !password) {
      return res.status(400).send(`All fields are required`);
    }

    // Checking if email matches with database.
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).send(`No User found. Please Sign up`);
    }

    // Saving token into cookie
    // const options = {
    //   expires: new Date(
    //     Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    // };

    const token = generateWebToken(email);
    // Comparing password with bcrypt
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        // .cookie('token', token, options)
        email,
        name: user.name,
        token,
      });
    } else {
      return res.status(400).send(`Invalid Credentials`);
    }
  } catch (err) {
    return res.status(400).send(`Error: ${err.message}`);
  }
};

const logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

const updateEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findByPk(req.user.email);

  if (!email) {
    res.status(400).send('Please send email with request');
  }

  const updatedUser = await User.update(
    { email, token: generateWebToken(email) },
    {
      where: {
        email: user.email,
      },
    }
  );

  res.status(200).send(updatedUser);
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.email);

    if (user) {
      res.json({
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).send('User Not Found');
    }
  } catch (error) {
    res.status(401).send(`Error : ${error}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateEmail,
  logout,
};
