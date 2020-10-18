module.exports.handleError = (err) => {
  console.log(err);
  if (err.message === 'NotFoundUserId') return { status: 404, message: 'Пользователь не найден' };
  if (err.message === 'NotFoundCardId') return { status: 404, message: 'Карточка не найдена' };
  if (err.name === 'ValidationError') return { status: 400, message: 'Неверные данные в запросе' };
  if (err.name === 'CastError') return { status: 400, message: 'Неверный _id в запросе' };
  return { status: 500, message: 'Ошибка на сервере' };
};
