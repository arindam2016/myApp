var app = angular.module('userControllers', ['userServices']);
app.controller('regCtrl', ['$http', '$location', '$timeout', 'User', function($http, $location, $timeout, User) {
   app = this;
   this.regUser = function(regData,valid) {
      app.errorMsg = false;
      app.loading = true;
      if (valid) {
         User.create(app.regData).then(function(response) {
            if (response.data.success) {
               app.loading = false;
               app.successMsg = response.data.message + '.......Redirecting';
               $timeout(function() {
                  $location.path('/');
               }, 2000);
            } else {
               $timeout(function() {
                  app.loading = false;
                  app.errorMsg = response.data.message;
               }, 1000);
            }
         });
      } else {
         app.loading = false;
         app.errorMsg = "Please ensure the form is fulfilled properly";
      }
   }
}]);
