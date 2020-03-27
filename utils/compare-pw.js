const bcrypt = require('bcryptjs');

const HttpError = require('../model/http-error');

const comparePw = async (password, userPassword, next) => {
  try {
    let isValidPw = false;

    isValidPw = await bcrypt.compare(password, userPassword);

    if (!isValidPw) {
      throw new HttpError(
        'Could not log you in. Please check your credentials.',
        403
      );
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = { comparePw };
