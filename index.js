require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

require('./db/mongoose');
require('./model/user');
const HttpError = require('./model/http-error');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});
app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json(
      error.code
        ? { error: error.message }
        : { error: 'An unknown error occurred.' }
    );
});

app.listen(process.env.PORT || 5000);
