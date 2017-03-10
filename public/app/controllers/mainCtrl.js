angular.module('mainController', ['authServices'])
   .controller('mainCtrl', ['Auth', '$location', '$timeout','$rootScope', function(Auth, $location, $timeout,$rootScope) {
      app = this;
      app.loadMe=false;
      $rootScope.$on('$routeChangeStart',function(){
         if (Auth.isLoggedIn()) {
            app.isLoggedIn=true;
            Auth.getUser().then(function(response){
               app.username=response.data.username;
               app.email=response.data.email;
               app.loadMe=true;
            });
         } else {
            app.isLoggedIn=false;
            app.username='';
            app.loadMe=true;
         }
      });
      app.doLogin = function(loginData) {
         app.errorMsg = false;
         app.loading = true;
         Auth.login(app.loginData).then(function(response) {
            if (response.data.success) {
               app.loading = false;
               app.successMsg = response.data.message + '.......Redirecting';
               $timeout(function() {
                  $location.path('/profile');
                  app.loginData='';
                  app.successMsg=false;
               }, 2000);
            } else {
               $timeout(function() {
                  app.loading = false;
                  app.errorMsg = response.data.message;
               }, 1000);
            }
         })
      };
      this.logout=function(){
         Auth.logout();
         $location.path('/logout');
         $timeout(function() {
            $location.path('/');
         }, 2000);
      };
   }]);
