const bcrypt = require('bcryptjs');

const User = require('../model/user');
const HttpError = require('../model/http-error');
const { comparePw, jwtSign } = require('../utils/index');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpError('Could not find the user.', 401);
    }

    await comparePw(password, user.password, next);

    const token = jwtSign(user.id, user.email);

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      token
    });
  } catch (error) {
    return next(error);
  }
};

const signUp = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new HttpError(
        'User already exists. Try login instead.',
        422
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new User({
      email,
      password: hashedPassword,
      username
    });

    await createdUser.save();

    const token = jwtSign(createdUser.id, createdUser.email);

    res.status(201).json({
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      token
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  const {
    username = null,
    email = null,
    password = null,
    newPassword = null
  } = req.body;
  const id = req.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      throw new HttpError('Could not find the user.', 401);
    }

    await comparePw(password, user.password, next);

    let newHashedPw;

    if (newPassword) {
      newHashedPw = await bcrypt.hash(newPassword, 12);
    }

    Object.assign(user, {
      username: username || user.username,
      email: email || user.email,
      password: newHashedPw || user.password
    });
    await user.save();
    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, signUp, update };
