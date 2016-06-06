var mod = angular.module('wingman.controllers.wingman', []);

mod.controller('WingmanCtrl', function($scope, MapService, $state) {

  console.log('do anything?');

  $scope.$emit('checkInitConnection', function(data) {

    console.log('checking connection');
    if (data === false) {
      MapService.initiateConnection();

      $scope.$emit('initiatedConnection', true);
    }

  });

  $scope.mapService = MapService;

  $scope.disconnect = function() {
    MapService.stopConnection();
    $scope.$emit('resetConnection', false);
    $state.go('tab.map');
  };

  $scope.chat = function() {
    $state.go('wingman-chat');

  };


});
