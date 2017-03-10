var DB = "mongodb://localhost:27017/myAppdb";
var port = process.env.PORT || 8000;
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require("body-parser");
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

//Using Middlewares For Logging
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', appRoutes);
//Database Connection

mongoose.connect(DB, function(err, db) {
   if (!err) {
      console.log("We are connected to " + DB);
   } else {
      console.log("Fail to connecte" + err);
   }
});
app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'public/app/views/index.html'));
});
//Create a Server Which Listening on port localhost:3000
app.listen(port, function() {
   console.log('MEAN app listening on port ' + port);
});
