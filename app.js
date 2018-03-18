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

app.post('/deposit', multipart.single('contents'), function (req, res) {
  // Use query markers (?) and parameters
  const query = 'INSERT INTO imgs (filename, contents, path) VALUES (?,?,?)';
  var fileBin = fs.readFileSync(req.file.path);
  const params = [req.body.filename, fileBin, req.file.path];
  // Set the prepare flag in the query options

  client.execute(query, params, { prepare: true })
    .then(result => console.log('Uploaded ' + params[0]));
  res.sendStatus(200);
})

app.get('/retrieve', multipart.single('contents'), function (req, res) {
  console.log("File: " + req.query.filename);

  // Use query markers (?) and parameters
  const query = 'SELECT path FROM imgs WHERE filename=?';
  const params = [req.query.filename];
  // Set the prepare flag in the query options
  var image;
  client.execute(query, params, { prepare: true }, function (err, result) {
    image = result.row[0].path;
    console.log("RESULT ARRAY: "+ result.row[0].path);
    console.log("RESULT: "+ result);
  });

  res.writeHead(200, {
    'Content-Type': 'image/jpeg'
  });
  var readStream = fs.createReadStream(image);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(res);
})

module.exports = app;