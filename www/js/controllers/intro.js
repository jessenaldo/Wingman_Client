var mod = angular.module('wingman.controllers.intro', []);

mod.controller('IntroCtrl', function($scope, $state, UserService) {

  $scope.loggingIn = false;

  $scope.login = function() {
    if (!$scope.loggingIn) {
      $scope.loggingIn = true;
      UserService.loginUser().then(function() {
        console.log('user is now logged in')
        $scope.loggingIn = false;
        $state.go('tab.map');
      })
    }
  }
})
