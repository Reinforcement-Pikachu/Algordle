//routes
const express = require('express');
// const app = express();
const router = express.Router();
// const port = 3333;
// const path = require('path');

router.get('/', (req, res) => {
    console.log('Success');
});

router.use((req, res) => res.sendStatus(404));


module.exports = router; //


// //global error handler
// app.use((err, req, res, next) => {
//     const defaultErr = {
//       log: 'Express error handler caught unknown middleware error',
//       status: 500,
//       message: { err: 'An error occurred' },
//     };
//     const errorObj = Object.assign({}, defaultErr, err);
//     console.log(errorObj.log);
//     return res.status(errorObj.status).json(errorObj.message);
//   });
  
//   app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
//   });
  