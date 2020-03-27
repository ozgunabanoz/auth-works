const jwt = require('jsonwebtoken');

const HttpError = require('../model/http-error');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      throw new HttpError('Authentication failed.', 403);
    }

    const decToken = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decToken.id;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { auth };
