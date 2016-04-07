/* angularJs在启动时会最先运行 `run` 方法 */
angular.module('techNodeApp', ['ngRoute']).
    run(function ($window, $rootScope, $http, $location) {
        /* 请求服务器，判断`session`是否有`user`信息 */
        $http({
            url: '/api/validate',
            method: 'GET'
        }).success(function (user) {
            // console.log(user)
            $rootScope.me = user
            // $location.path('/')
            $location.path('/rooms')
        }).error(function (data) {
            $location.path('/login')
        })
        /* 用户退出时候调用清除`session`中的`user`信息 */
        $rootScope.logout = function() {
            $http({
                url: '/api/logout',
                method: 'GET'
            }).success(function () {
                $rootScope.me = null
                $location.path('/login')
            })
        }
        /* 用户登入的时候在 `$rootScope.me` 中记录用户信息，暂时不知道做什么用的 */
        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me
        })
    })