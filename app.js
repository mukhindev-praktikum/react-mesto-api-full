require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { celebrate, Joi, CelebrateError } = require('celebrate');
const userRoutes = require('./routes/users.js');
const cardRoutes = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const BadRequestError = require('./errors/bad-request-err');
const NotFoundError = require('./errors/not-found-err.js');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

const userJoiSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate(userJoiSchema), createUser);
app.post('/signin', celebrate(userJoiSchema), login);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  let error = err;
  if (error instanceof CelebrateError) error = new BadRequestError();
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
