const _ = require('lodash');
const { validationResult } = require('express-validator');

const HttpError = require('../model/http-error');

const errorHandler = (req, res, next) => {
  const errorsArr = validationResult(req);

  if (!errorsArr.isEmpty()) {
    let errors = _(errorsArr.array())
      .groupBy('param')
      .mapValues(group => group[0].msg)
      .value();

    return next(new HttpError(errors, 422));
  }

  next();
};

module.exports = { errorHandler };
