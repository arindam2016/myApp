var app = angular.module('authServices', []);
app.factory('Auth', ['$http', 'AuthToken', function($http, AuthToken) {
   var authFactory = {};
   //Auth.login(loginData);
   authFactory.login = function(loginData) {
      return $http.post('/api/authenticate', loginData).then(function(response) {
         console.log(response.data.token);
         AuthToken.setToken(response.data.token);
         return response;
      });
   };
   //Auth.isLoggedIn();
   authFactory.isLoggedIn = function() {
      if (AuthToken.getToken()) {
         return true;
      } else {
         return false;
      }
   };
   return authFactory;
}]);
app.factory('AuthToken', [function() {
   var authTokenFactory = {};

   //AuthToken.setToken(token);
   authTokenFactory.setToken = function(token) {
      window.localStorage.setItem('token', token);
   };

   //AuthToken.getToken();
   authTokenFactory.getToken = function() {
      return window.localStorage.getItem('token');
   };

   return authTokenFactory;
}]);
