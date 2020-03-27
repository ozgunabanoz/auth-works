const router = require('express').Router();
const { check } = require('express-validator');

const { login, signUp, update } = require('../controllers/user');
const { auth, errorHandler } = require('../middleware/index');

router.post('/login', login);
router.post(
  '/signup',
  [
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be min 8 characters long.'),
    check('email')
      .isEmail()
      .withMessage('Invalid email.')
  ],
  errorHandler,
  signUp
);
router.use(auth);
router.post(
  '/update',
  [
    check('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email.')
  ],
  errorHandler,
  update
);

module.exports = router;
