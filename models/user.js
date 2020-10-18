const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return isEmail(value);
      },
      message: (props) => `${props.value} не является email адресом!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return isURL(value);
      },
      message: (props) => `${props.value} не является совместимой ссылкой!`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
