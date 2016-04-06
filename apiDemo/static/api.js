var myApp = angular.module('apiApp', ['ui.router', 'door3.css', 'ngCookies', 'ngResource'])
    
myApp.run(function($rootScope) {
    $rootScope.name = 'bert';
    $rootScope.$on('show', function(event, data, data2, data3) {
        console.log('event: ');
        console.log(event);
        console.log('data: ');
        console.log(data);
        console.log('data2');
        console.log(data2);
        console.log('data3');
        console.log(data3);
        data3();
    });
})