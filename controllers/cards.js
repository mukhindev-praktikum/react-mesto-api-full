const Card = require('../models/card.js');
const { handleError } = require('../helpers/handle-error.js');

module.exports.createCard = (req, res) => {
  const { _id: userId } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotFoundCardId'))
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  const { _id: userId } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFoundCardId'))
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id: userId } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFoundCardId'))
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = handleError(err);
      res.status(status).send({ message });
    });
};
