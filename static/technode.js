/* angularJs在启动时会最先运行 `run` 方法 */
angular.module('techNodeApp', ['ngRoute']).
    run(function ($window, $rootScope, $http, $location) {
        /* 请求服务器，判断`session`是否有`user`信息 */
        $http({
            url: '/api/validate',
            method: 'GET'
        }).success(function (user) {
            $rootScope.me = user
            $location.path('/')
        }).error(function (data) {
            $location.path('/login')
        })
        /* 用户退出时候调用清除`session`中的`user`信息 */
        $rootScope.logout = function() {
            console.log($rootScope.me)
            $http({
                url: '/api/logout',
                method: 'GET'
                }).success(function () {
                $rootScope.me = null
                $location.path('/login')
            })
        }
        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me
        })
    })