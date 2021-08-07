require('dotenv').config();
require('./dbmongo');

const express = require('express');
const cors = require('cors');

const userRouter = require('./controllers/userRouter');
const loginRouter = require('./controllers/login');
const userAdminRouter = require('./controllers/userAdminRouter');

const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');

const app = express();

app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 4000);

app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/admin', userAdminRouter);

app.use(notFound);
app.use(handleErrors);

app.listen(app.get('port'), () => {
  console.log('Servidor en puerto ' + app.get('port'));
});