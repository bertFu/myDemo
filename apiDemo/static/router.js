myApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'LoginCtrl',
            })
            .state('index', {
                url: '/index',
                views: {
                    '': {
                        templateUrl: 'pages/index.html',
                        controller: 'IndexCtrl',
                    }
                }
            })
            .state('/', {
                url: '/',
                views: {
                    '': {
                        templateUrl: 'pages/index.html',
                        controller: 'IndexCtrl',
                    }
                }
            })
    })