const jwt = require('jsonwebtoken');

const jwtSign = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: 60 * 15
  });
};

module.exports = { jwtSign };
