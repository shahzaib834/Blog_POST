const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateWebToken = (id) => {
  const secretKey = process.env.JWT_TOKEN_KEY;
  return jwt.sign({ id }, secretKey, {
    expiresIn: '2d',
  });
};

module.exports = generateWebToken;
