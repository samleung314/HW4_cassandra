// app.js
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//create express app
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/deposit', function (req, res) {
  console.log("FILE: " + req.body);
  res.sendStatus(200);
})

app.get('/retrieve', function (req, res) {
  res.sendStatus(200);
})

module.exports = app;