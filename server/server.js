//main server (express entry point)

const express = require('express');
// const path = require("path");
const apiRoute = require('./routes/apiRoute');

const pool = require('./config/db');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

// app.use(express.static(path.join(__dirname, "public")));
console.log('server is starting');

app.get('/test-db', async (req, res) => {
  console.log('recieved request to /test-db');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('db query result called in server.js:', result.rows[0])
    res.json({ success: true, time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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
})