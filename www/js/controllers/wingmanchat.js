var mod = angular.module('wingman.controllers.wingmanchat', []);

mod.controller('WingmanChatCtrl', function($scope, $state, $firebaseArray, UserService, MapService) {

  $scope.user = UserService;

  $scope.data =  {
    messages: [],
    message: '',
    loading: true
  };

  $scope.loadMessages = function() {

    messagesRef = new Firebase(MapService.myRoomRef + "/messages");

    var query = messagesRef.orderByChild("timestamp");

    $scope.data.messages = $firebaseArray(query);
    $scope.data.messages.$loaded().then(function(data) {
      console.log('AngularFire $loaded');
      console.log($scope.data.messages);

    })

  };



  $scope.sendMessage = function() {
    if($scope.data.message) {

      messagesRef = new Firebase(MapService.myRoomRef + "/messages");
      var query = messagesRef.orderByChild("timestamp");
      $scope.data.messages = $firebaseArray(query);
      $scope.data.messages.$add( {
        text: $scope.data.message,
        username: $scope.user.current.name,
        userId: $scope.user.current.userId,
        profilePic: $scope.user.current.profilePic,
        timestamp: new Date().getTime()
      });
      console.log($scope.data.messages);
      $scope.data.message = '';
    }

  }

  $scope.loadMessages();

});
