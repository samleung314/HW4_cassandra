// app.js
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var cassandra = require('cassandra-driver');
var async = require('async');

//Connect to the cluster
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hw4' });

// multer
var multer  = require('multer');
var multipart = multer();

//create express app
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/deposit', multipart.single('contents'), function (req, res) {
  console.log(req);
  // Use query markers (?) and parameters
  const query = 'INSERT INTO imgs (filename, contents) VALUES (?,?)';
  const params = [req.body.filename, req.file];
  // Set the prepare flag in the query options
  console.log('EXECUTE');
  client.execute(query, params, { prepare: true })
    .then(result => console.log('Row updated on the cluster'));
    res.sendStatus(200);
})

app.get('/retrieve', function (req, res) {
  res.sendStatus(200);
})

module.exports = app;