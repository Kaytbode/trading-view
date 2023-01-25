const express = require('express');
const router = require('./routes/index');
const app = express()
const cors = require('cors');

app.use(cors());

app.use(router);

app.listen(process.env.PORT);