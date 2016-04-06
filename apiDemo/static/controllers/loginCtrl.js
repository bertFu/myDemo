myApp.controller('LoginCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope, myFactory) {
    $scope.text = 'hello login';
    
     $scope.click = function(){
        $scope.$broadcast('aaa');
        $scope.$broadcast('show-chlid');
        $scope.$broadcast('show-parent');
    }
    // console.log('————————————factory————————————————');
    // console.log('我们是可以通过 `getNum1()`，来获取 `myFactory` 服务中的 `_num1` 的值的：' + myFactory.getNum1());
    // console.log('但是我们直接获取 `_num1` 的值是会失败的，直接获取会打印出什么呢：' + myFactory._num1);
    // myFactory.setNum1(111);
    // console.log('我我们设置完 `_num1` 的值后，计算 `_num1` + `_num2` 的值是：' + myFactory.test());
    // console.log('————————————————————————————');    
});
// 子级控制器
myApp.controller('ChlidCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope, myService, myFactory) {
            
    $scope.$on('show-chlid', function() {
        console.log('我是子控制器，我叫ChildCtrl, 我监听着show-chlid');
    });
    $scope.$on('show-parent', function() {
        console.log('我是子控制器，我叫ChildCtrl, 我监听着show-parent');
    });
    
    $scope.chlidClick = function() {
        console.log('我们在子控制器中获取下刚刚设置过的 `myFactory` 的值：');
        console.log(myFactory.getNum1());
        console.log('我们并没有设置什么，但是数据共享了。');
    }
    
    
    // console.log('————————————Service————————————————');
    // console.log(myService.getNum1());
    // myService.setNum1(222);
    // console.log(myService.test());
    // console.log(myService._num1);
    // console.log(myService._num2);
    // console.log('————————————————————————————');
});
// 父级控制器
myApp.controller('ParentCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope) {
    
    console.log('我在父控制器中：' + $scope.text);
    
    $scope.$on('show-chlid', function() {
        console.log('我是父控制器，我监听着：show-chlid');
    });
    
    $scope.$on('show-parent', function() {
        console.log('我是父控制器，我监听着：show-parent');
    });
});
// 按钮所在的控制器
myApp.controller('SelfCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope) {
    
    $scope.click = function(){
        $scope.$broadcast('aaa');
        $scope.$broadcast('show-chlid');
        $scope.$broadcast('show-parent');
    }
});
// 兄弟控制器
myApp.controller('BroCtrl', function($scope, $timeout, $injector, $interpolate, $rootScope) {
  
    $scope.$on('show-chlid', function() {
        console.log('我是兄弟控制器，我监听着：show-chlid');
    });
    
    $scope.$on('show-parent', function() {
        console.log('我是兄弟控制器，我监听着：show-parent');
    });
});

myApp.directive('aaa', function() {
    return{
        restrice: 'A,E',
        // scope:{},
        template: '<div>lalalla</div>',
        link: function(scope, element, attr){
            scope.$on('aaa', function(){
                console.log('aaa 这里是指令中。');
            });
            console.log('指令中的scope：', scope.text);
        }
    }
});