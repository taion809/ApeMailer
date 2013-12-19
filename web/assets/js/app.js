var apeMailerApp = angular.module('apeMailerApp', [
    'ngRoute',
    'apeMailerControllers'
]);

apeMailerApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/partials/email-dashboard.html',
        controller: 'EmailDashboard'
    }).
    when('/emails/:email_id', {
        templateUrl: '/partials/email-details.html',
        controller: 'EmailDetails'
    }).
    otherwise({
        redirectTo: "/"
    });
}]);
