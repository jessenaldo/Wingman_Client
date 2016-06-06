var app = angular.module('wingman.services.map', []);

app.service('MapService', function ($q,
                                    $http,
                                    $cordovaGeolocation,
                                    $ionicPopup,
                                    $localstorage,
                                    FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);



  var self = {
    'lat': '',
    'lon': '',
    'myRoomRef': '',
    'watch': '',
    'winglat': '',
    'winglon': '',

    'load': function() {
      //var deferred = $q.defer();

        ionic.Platform.ready(function () {
          $cordovaGeolocation
            .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
            .then(function (position) {
              console.log(position.coords.latitude);
              console.log(position.coords.longitude);
              self.lat = position.coords.latitude;
              self.lon = position.coords.longitude;
              //
              var currentUserId = $localstorage.get('wingman-user', null);
              console.log(currentUserId);

              var locationsRef = new Firebase(FIREBASE_URL + "/locations");
              var geoFire = new GeoFire(locationsRef);
              console.log(geoFire);

              geoFire.set(currentUserId, [self.lat, self.lon]).then(function () {
                console.log("User" + currentUserId + " set to [" + self.lat, self.lon + "]");
              }, function (error) {
                console.log("Error: " + error);
              })

            }, function (err) {
              console.error("Error getting position");
              console.error(err);
              $ionicPopup.alert({
                'title': 'Please switch on geolocation',
                'template': "It seems like you've switched off geolocation for Wingman, please turn it on by going to your application settings."
              })
            })
        });


      //return deferred.promise;
    },
    'findWingman': function() {
      var deferred = $q.defer();

      console.log(self.lat);
      var currentUserId = $localstorage.get('wingman-user', null);
      console.log(currentUserId);
      $http.post("http://localhost:8000/requestwingman", {'userId': currentUserId, 'center': [self.lat, self.lon], 'radius': 9999999 }).success(function(data) {
        console.log("Received from server" + data);
        deferred.resolve();
      });

      return deferred.promise;
    },
    'initiateConnection': function() {
      console.log('initiating connection');
      ionic.Platform.ready(function() {
        console.log('platform ready');
        var currentUserId = $localstorage.get('wingman-user', null);
        var roomsRef = new Firebase(FIREBASE_URL + "/rooms");
        var myRoomRef = new Firebase(roomsRef + "/" + currentUserId);
        self.myRoomRef = myRoomRef;
        var myRoomLocRef = new Firebase(myRoomRef + "/location");
        var myRoomLocClientRef = new Firebase(myRoomLocRef + "/client");

        self.watch = $cordovaGeolocation.watchPosition({timeout: 10000, enableHighAccuracy: true});
        self.watch.then(
            null,
            function(err) {
              console.log(err);
            },
            function(position){

              console.log(position.coords.latitude);
              console.log(position.coords.longitude);

              self.lat = position.coords.latitude;
              self.lon = position.coords.longitude;

              myRoomLocClientRef.set({lat: self.lat, lon: self.lon});


          });

        var myRoomLocWingRef = new Firebase(myRoomLocRef + "/wingman");

        myRoomLocWingRef.on("value", function(snapshot) {
          var data = snapshot.val();
          if (self.winglat && self.winglon) {
            self.winglat = data.lat;
            self.winglon = data.lon;
          }
        })

      })
    },
    'joinConnection': function(joinRoomId) {
      console.log('joining connection');
      ionic.Platform.ready(function() {

        self.myRoomRef = new Firebase(FIREBASE_URL + "/rooms/" + joinRoomId);
        var myRoomLocRef = new Firebase(self.myRoomRef + "/location");
        var myRoomLocWingmanRef = new Firebase(myRoomLocRef + "/wingman");

        self.watch = $cordovaGeolocation.watchPosition({timeout: 10000, enableHighAccuracy: true});
        self.watch.then(
          null,
          function(err) {
            console.log(err);
          },
          function(position){
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            self.lat = position.coords.latitude;
            self.lon = position.coords.longitude;

            myRoomLocWingmanRef.set({lat: self.lat, lon: self.lon});

          })

        var myRoomLocClientRef = new Firebase(myRoomLocRef + "/client");

        myRoomLocClientRef.on('value', function(snapshot) {
          var data = snapshot.val();
          if (self.winglat && self.winglon) {
            self.winglat = data.lat;
            self.winglon = data.lon;
          }
        })

      })
    },
    'stopConnection': function() {
      console.log('disconnecting');
      ionic.Platform.ready(function() {

        self.watch.clearWatch();

        self.myRoomRef.remove(function(error) {
          if (error) {
            console.log('Synchronization failed');
          } else {
            console.log('Remove room and disconnect succeeded');

          }
        });
      })
    }
  };



  return self;
});
