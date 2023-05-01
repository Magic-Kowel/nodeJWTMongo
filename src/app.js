const express = require('express');
require('./database');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(require('./controller/authController'));
module.exports = app;