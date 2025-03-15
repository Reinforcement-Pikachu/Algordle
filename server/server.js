const express = require('express');

const apiRoute = require('./routes/apiRoute');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use('/api', apiRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})