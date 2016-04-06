myApp.service('myService', function($http, $q) {
    var service = {};
    var baseUrl = 'http://baidu.com';
    var _num1 = 2;
    var _num2 = 1;
    
    this._num1 = _num1;
    
    var sum = function(num1, num2) {
        return num1 + num2;
    }
    
    this.setNum1 = function(num1) {
        this._num1 = num1;
    }
    
    this.getNum1 = function() {
        return _num1;
    }
    
    this.test = function() {
        var a = sum(_num1, _num2);
        return a;
    }
    
    // return service;
}) 