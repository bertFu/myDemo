myApp.controller('IndexCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope) {
    $scope.text = 'hello world';
    $scope.clock = {};
    var updateClock = function() {
        $scope.clock.now = new Date();
        $timeout(function() {
            updateClock();
        }, 1000)
    };
    updateClock();
    $scope.to = 'ari@fullstack.io';
    $scope.emailBody = 'Hello {{ to }},\n\nMy name is Ari too!';


    $scope.$watch('emailBody', function(body) {
        if(body) {
            var template = $interpolate(body);
            $scope.previewText = template({to: $scope.to});
        }
    })
    
    $scope.dx = function(str) {
        return 'haha';
    }
    
    $scope.json = {
        name: 'bert',
        pwd: '123'
    }
    
    $scope.textFun = function(a) {
        console.log('a: ' + a);
        return function(b) {
            console.log('b: ' + b);
        }
    }
    
    $rootScope.$broadcast('show-index', 'bert-index', '$scope.text', function(){
        console.log('lalalal-index');
    });
});