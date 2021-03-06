const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  const decodeToken = jwt.verify(token, process.env.WORD_SECRET);
  if (!token || !decodeToken.id) {
    return res.status(401).json({error: 'token missing or invalid'});
  }

  const {id: userId, type} = decodeToken;
  if ( type === 0)
    return res.status(400).json({
      error: 'This user is not valid'
    });
  req.userId = userId;
  req.type = type;
  next();
};