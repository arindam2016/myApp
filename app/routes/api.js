var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
module.exports = function(router) {
   //http://localhost:8080/api/users
   router.post('/users', function(req, res) {
      var user = new User();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      if (req.body.name == null || req.body.name == '' || req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
         res.json({
            success: false,
            message: "Please Fill all the fields !"
         });
      } else {
         user.save(function(err) {
            if (err) {
               if (err.errors) {
                  if (err.errors.name) {
                     res.json({
                        success: false,
                        message: err.errors.name.message
                     });
                  } else if (err.errors.email) {
                     res.json({
                        success: false,
                        message: err.errors.email.message
                     });
                  } else if (err.errors.username) {
                     res.json({
                        success: false,
                        message: err.errors.username.message
                     });
                  } else if (err.errors.password) {
                     res.json({
                        success: false,
                        message: err.errors.password.message
                     });
                  } else {
                     res.json({
                        success: false,
                        message: err
                     });
                  }
               } else if (err) {
                  if (err.code == 11000) {
                     if (err.errmsg[60] == 'u') {
                        res.json({
                           success: false,
                           message: "Username already taken"
                        });
                     } else if (err.errmsg[60] == 'e') {
                        res.json({
                           success: false,
                           message: "E-mail already taken"
                        });
                     }
                  } else {
                     res.json({
                        success: false,
                        message: err
                     });
                  }
               }
            } else {
               res.json({
                  success: true,
                  message: "User Created!"
               });
            };
         });
      };
   });
   // //USER LOGIN ROUTE
   // //http://localhost:8080/api/authenticate
   // router.post('/authenticate', function(req, res) {
   //    if (req.body.username) {
   //       User.findOne({
   //          username: req.body.username
   //       }).select('username').exec(function(err, user) {
   //          if (err) {
   //             res.json({
   //                success: false,
   //                message: err
   //             });
   //          }
   //       });
   //    });
   // });
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
               var token = jwt.sign({
                  username: user.username,
                  email: user.email
               }, secret, {
                  expiresIn: '24h'
               });
               res.json({
                  success: true,
                  message: "User Authenticated",
                  token: token
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
router.use(function(req, res, next) {
   var token = req.body.token || req.body.query || req.headers['x-access-token'];
   if (token) {
      jwt.verify(token, secret, function(err, decoded) {
         if (err) {
            res.json({
               success: false,
               message: "Invalid token"
            });
         } else {
            req.decoded = decoded;
            next();
         }
      });
   } else {
      res.json({
         success: false,
         message: "No token Provided"
      });
   }
});
//http://localhost:8080/api/me
router.post('/me', function(req, res) {
   res.send(req.decoded);
});
return router;
}
