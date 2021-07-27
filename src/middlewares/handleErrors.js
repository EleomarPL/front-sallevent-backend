const ERROR_HANDLERS = {
  defaultError: res => res.status(500).end(),
  MongoError: (res, err) =>
    res.status(409).send({error: err.message}),
  ValidationError: (res, err) => res.status(409).send({error: err.message}),
  JsonWebTokenError: (res) =>
    res.status(401).json({error: 'Token missing or invalid'})
};

module.exports = (error, req, res, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
  handler(res, error);
};