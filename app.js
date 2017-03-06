//Including the modules
var express = require('express');
//Creating a express Object
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
//Using Middlewares For Logging
app.use(morgan('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
//http://localhost:3000/api/users
app.use('/api', appRoutes);
//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/myAppdb", function(err, db) {
   if (!err) {
      console.log("We are connected");
   } else {
      console.log("Fail");
   }
});
app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'public/app/views/index.html'));
});
//Create a Server Which Listening on port localhost:3000
app.listen(port, function() {
   console.log('MEAN app listening on port ' + port);
});
