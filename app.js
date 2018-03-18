// app.js
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var cassandra = require('cassandra-driver');
var async = require('async');

//Connect to the cluster
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hw4' });

// multer
var multer = require('multer');
var multipart = multer({ dest: 'uploads/' });

//create express app
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var last;

app.post('/deposit', multipart.single('contents'), function (req, res) {
  // Use query markers (?) and parameters
  const query = 'INSERT INTO imgs (filename, contents) VALUES (?,?)';
  var fileBin = fs.readFileSync(req.file.path);
  const params = [req.body.filename, fileBin];
  // Set the prepare flag in the query options
  last = Object.assign({}, req.file.path);
  console.log(last);
  client.execute(query, params, { prepare: true })
    .then(result => console.log('Uploaded ' + params[0]));
  res.sendStatus(200);
})

app.get('/retrieve', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
  });
  console.log("RETRE " + last);
  var readStream = fs.createReadStream(last.toString());
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
})

module.exports = app;