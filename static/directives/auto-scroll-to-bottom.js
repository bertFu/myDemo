/* 
    监听模型信息变化，将滚动条移动至最底部，以便能查询到最新显示的信息 
*/
angular.module('techNodeApp').directive('autoScrollToBottom', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(
        function() {
          return element.children().length;
        },
        function() {
          element.animate({
            scrollTop: element.prop('scrollHeight')
          }, 1000);
        }
      );
    }
  };
});