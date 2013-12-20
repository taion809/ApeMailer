'use strict';

var apeMailerControllers = angular.module('apeMailerControllers', []);

apeMailerControllers.controller('EmailDashboard', ['$scope', '$http', function($scope, $http) {
    $http.get('/initialize').success(function(data) {
        $scope.user = data.user;
        $scope.user.username = splitEmail(data.user.email_addr);

        $scope.email = data.email;
        $scope.domain_list = data.domain_list;
    });

    $scope.setEmail = function() {
        var username = $scope.user.username;
        var domain = $scope.domain_list[$scope.domain].host;

        $http.post('/me', { username: username + "@" + domain }).success(function(data) {
            $scope.user = data.user;
            $scope.user.username = splitEmail(data.user.email_addr);
            $scope.email = data.email;
        });
    }

    $scope.deleteEmail = function(emailId) {
        $http({method: 'DELETE', url: '/remove', params: { email_id: emailId }})
            .success(function(data){
                for(var i = 0; i < data.email.length; i++) {
                    for(var j = 0; j < $scope.email.list.length; j++) {
                        if($scope.email.list[j].mail_id == data.email[i]) {
                            $scope.email.list.splice(j, 1);
                        }
                    }
                }
            });
    }

    $scope.domain = 0;
}]);

apeMailerControllers.controller('EmailDetails', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    $http.get('/fetch', { params: { email_id: $routeParams.email_id } }).success(function(data) {
        $scope.user = data.user;
        $scope.email = data.email;

        console.log(data);
    });

    $scope.deleteEmail = function(emailId) {
        $http({method: 'DELETE', url: '/remove', params: { email_id: emailId }})
            .success(function(data){
                $location.path('/');
            });
    }
}]);

function splitEmail(email) {
    var split = email.split('@');

    return split[0];
}

