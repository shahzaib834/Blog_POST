const { PrismaClient } = require('@prisma/client');

let prisma;
try {
  prisma = new PrismaClient();
  console.log('DB connected!');
} catch (err) {
  console.log(err);
}

module.exports = { prisma };
