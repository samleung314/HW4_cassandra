// server.js
var app = require('./app');
var port = process.env.PORT || 80;

var server = app.listen(port, function () {
   console.log("HW4 Cassandra listening on port: " + port)
})