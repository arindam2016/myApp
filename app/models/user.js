var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');

var nameValidator = [
   validate({
      validator: 'matches',
      arguments: /^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$/,
      message: "Name Must be 3 Charecters,max 30, No Spcial Charecters and numbers, Must have a space between first and last name"
   })
];
var emailValidator = [
   validate({
      validator: 'isEmail',
      message: "Please enter a valid mail id"
   }),
   validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
   })
];

var usernameValidator = [
   validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
   }),
   validate({
      validator: 'isAlphanumeric',
      message: "Username should contain alpha-numeric characters only"
   })
];
var passwordValidator = [
   validate({
      validator: 'matches',
      arguments: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/,
      message: "Password Must be 6 Charecters,max 30,Must have one lowercase characters,one uppercase characters one Spcial Charecters and one number Sample arindam1A@"
   })
];
var userSchema = new Schema({
   name: {
      type: String,
      required: true,
      validate: nameValidator
   },
   username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      validate: usernameValidator
   },
   password: {
      type: String,
      required: true,
      validate: passwordValidator
   },
   email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      validate: emailValidator
   }
});
userSchema.pre('save', function(next) {
   var user = this;
   bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
   });
});
// Attach some mongoose hooks
userSchema.plugin(titlize, {
   paths: ['name']
});
userSchema.methods.comparePassword = function(password) {
   return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('user', userSchema);
