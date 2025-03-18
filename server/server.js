//main server (express entry point)
require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const apiRoute = require('./routes/apiRoute');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new pgSession({ pool: db, tableName: 'sessions' }), // Ensure table exists
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// app.use(express.static(path.join(__dirname, "public")));
app.use('/api', apiRoute);

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
