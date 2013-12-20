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

    $scope.domain = 0;
}]);

apeMailerControllers.controller('EmailDetails', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $http.get('/fetch', { params: { email_id: $routeParams.email_id } }).success(function(data) {
        $scope.user = data.user;
        $scope.email = data.email;

        console.log(data);
    });
}]);

function splitEmail(email) {
    var split = email.split('@');

    return split[0];
}

