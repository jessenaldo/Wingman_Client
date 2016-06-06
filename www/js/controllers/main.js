var mod = angular.module('wingman.controllers.main', []);

mod.controller('MainCtrl', function($scope) {

  initConnection = false;

  $scope.$on('checkInitConnection', function (event, callback) {

    callback(initConnection);
  });

  $scope.$on('initiatedConnection', function(event, data) {
    initConnection = data;
  });

  $scope.$on('resetConnection', function(event, data) {
    initConnection = data;
  })



});
