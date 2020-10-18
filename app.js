const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users.js');
const cardRoutes = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
app.use(express.urlencoded({ extended: false }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.all('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
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
  console.log(`Server listening on port ${PORT}`);
});
