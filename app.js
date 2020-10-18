const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users.js');
const cardRoutes = require('./routes/cards.js');

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

app.use((req, res, next) => {
  req.user = {
    _id: '5f6a03c1533a7b21e2156252',
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.all('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
