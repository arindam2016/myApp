var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret='harrypotter';
module.exports = function(router) {
   //Create Post Route
   //USER REGISTRATION ROUTE
   //http://localhost:8080/api/users
   router.post('/users', function(req, res) {
      var user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
         res.json({
            success: false,
            message: "Please Fill all the fields !"
         });
      } else {
         user.save(function(err) {
            if (err) {
               res.json({
                  success: false,
                  message: "Username Or Email is already Present !"
               });
            } else {
               res.json({
                  success: true,
                  message: "User Created!"
               });
            };
         });
      };
   });
   //USER LOGIN ROUTE
   //http://localhost:8080/api/authenticate
   router.post('/authenticate', function(req, res) {
      if (req.body.username) {
         User.findOne({
            username: req.body.username
         }).select('email username password').exec(function(err, user) {
            if (err) {
               res.json({
                  success: false,
                  message: err
               });
            }
            if (!user) {
               res.json({
                  success: false,
                  message: "Could not Authenticate user !"
               });
            } else if (user) {
               if (req.body.password) {
                  var validPassword = user.comparePassword(req.body.password);
               } else {
                  res.json({
                     success: false,
                     message: "No Password Provided!"
                  });
               }
               if (!validPassword) {
                  res.json({
                     success: false,
                     message: "Could not Authenticate Password !"
                  });
               } else {
                  var token=jwt.sign({
                     username:user.username,
                     email:user.email
                  }, secret, { expiresIn: '24h' });
                  res.json({
                     success: true,
                     message: "User Authenticated",
                     token:token
                  });
               }
            }
         });
      } else {
         res.json({
            success: false,
            message: "No user name Provided"
         });
      }
   });
   return router;
}
