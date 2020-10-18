module.exports.handleError = (err) => {
  if (err.message === 'NotFoundUserId') return { status: 404, message: 'Пользователь не найден' };
  if (err.message === 'NotFoundCardId') return { status: 404, message: 'Карточка не найдена' };
  if (err.message === 'ForbiddenDeleteThisCard') return { status: 401, message: 'Запрещено удалять чужие карточки' };
  if (err.name === 'ValidationError') return { status: 400, message: 'Неверные данные в запросе' };
  if (err.name === 'MongoError' && err.code === 11000) return { status: 500, message: 'Пользователь с данным email уже есть' };
  if (err.name === 'CastError') return { status: 400, message: 'Неверный _id в запросе' };
  return { status: 500, message: 'Ошибка на сервере' };
};
