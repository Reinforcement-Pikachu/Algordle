//main server (express entry point)

const express = require('express');
// const path = require("path");
const apiRoute = require('./routes/apiRoute');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

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
})