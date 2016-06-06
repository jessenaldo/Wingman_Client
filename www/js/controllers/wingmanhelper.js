mod = angular.module('wingman.controllers.wingmanhelper', []);

mod.controller('WingmanHelperCtrl', function($scope, $state, MapService) {
  console.log('Loading wingmanhelper');

  console.log($state.params);



  $scope.$emit('checkInitConnection', function(data) {
    console.log('checking connection');
    if(data === false) {
      MapService.joinConnection($state.params.param);

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
