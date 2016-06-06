var mod = angular.module('wingman.controllers.map', []);

mod.controller('MapCtrl', function(NgMap, $scope, $interval, MapService, $state) {

  MapService.load();
  $scope.mapService = MapService;

  $scope.requestWingman = function() {

    MapService.findWingman().then(function() {
      console.log('Server is finding a wingman');
      $state.transitionTo('wingman');
      $state.go('wingman');
    })
  };

  $scope.updateLocation = function() {
    $scope.mapService = MapService.load();
  }



});


