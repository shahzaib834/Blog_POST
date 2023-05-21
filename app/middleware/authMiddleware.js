const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: 'Access Denied : Please log in first to access this route',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

    req.user = await prisma.users.findUnique({
      where: {
        email: decoded.id,
      },
    }); //User.findByPk(decoded.id);

    next();
  } catch (error) {
    res.status(400).send(`Error : ${error}`);
  }
};

const authorizeRoles = ([...roles]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          success: false,
          message: `Role: ${req.user.role} is not allowed to access this resource`,
        })
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
