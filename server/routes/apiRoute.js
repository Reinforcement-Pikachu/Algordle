const express = require('express');
const app = express();
const port = 3333;
const path = require('path');

app.get('/', (req, res) => {
    console.log('Success');
});

app.use((req, res) => res.sendStatus(404));

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
    console.log(`Listening on port ${port}`);
  });
  