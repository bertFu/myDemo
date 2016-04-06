myApp.factory('myFactory112', function($http, $q) {
    var service = {};
    var baseUrl = 'http://baidu.com';
    var _num1 = 2;
    var _num2 = 1;
    
    var jia = function(num1, num2) {
        return num1 + num2;
    }
    
    service.setNum1 = function(num1) {
        _num1 = num1;
    }
    
    service.getNum1 = function() {
        return _num1;
    }
    
    service.test = function() {
        var a = jia(_num1, _num2);
        return a;
    }
    
    return service;
}) 
myApp.factory('myFactory1112323', function($http, $q) {
    var service = {};
    var baseUrl = 'http://baidu.com';
    var _num1 = 2;
    var _num2 = 1;
    
    var jia = function(num1, num2) {
        return num1 + num2;
    }
    
    service.setNum1 = function(num1) {
        _num1 = num1;
    }
    
    service.getNum1 = function() {
        return _num1;
    }
    
    service.test = function() {
        var a = jia(_num1, _num2);
        return a;
    }
    
    return service;
}) 