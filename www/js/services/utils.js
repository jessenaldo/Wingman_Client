var app = angular.module('wingman.utils', []);

app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value)  {
      $window.localStorage[key] = value;
    },
    //will return null if no key
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    //localStorage can only accept an object as JSON
    //JSON.stringify() method converts a Javasciprt value to a JSON string
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    //JSON.parse() parses a string as JSON
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);


app.directive('ngEnter', function() {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  }
});
