angular.module('mainController', ['authServices'])
    .controller('mainCtrl', ['Auth', '$location', '$timeout', function(Auth, $location, $timeout) {
        app = this;
        if (Auth.isLoggedIn()) {
            console.log('Success : User is logged in');
        } else {
            console.log('Fail : User is not logged in');
        }
        app.doLogin = function(loginData) {
            app.errorMsg = false;
            app.loading = true;
            Auth.login(app.loginData).then(function(response) {
                if (response.data.success) {
                    app.loading = false;
                    app.successMsg = response.data.message + '.......Redirecting';
                    /*$timeout(function() {
                       $location.path('/about');
                    }, 2000);*/
                } else {
                    $timeout(function() {
                        app.loading = false;
                        app.errorMsg = response.data.message;
                    }, 1000);
                }
            })
        }
    }]);
