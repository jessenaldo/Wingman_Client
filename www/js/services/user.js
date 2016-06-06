var app = angular.module('wingman.services.userService', []);

app.service('UserService', function (FIREBASE_URL,
                                      $q,
                                      $rootScope,
                                      $localstorage,
                                      $ionicPopup, $firebaseAuth, $firebaseObject) {

  var ref = new Firebase(FIREBASE_URL);
  var usersRef = new Firebase(FIREBASE_URL + "/users");

  var self = {
      //contains the currently logged in user
      current: {},
      token: "",

      loadUser: function() {
        //creating a promise which what you're returning
        var d = $q.defer();

        // Check local storage to see if there is a user already logged in
        var currentUserId = $localstorage.get('wingman-user', null);
        if (currentUserId && currentUserId != "null") {
          // If there is a logged in user then load up the object via firebase
          // and use $firebaseObject to keep it in sync between our
          // application and firebase
          console.debug("Found previously logged in user, loading from firebase", currentUserId);
          //download the current user Id's profile data into a local object
          //all server changes are applied in realtime
          var user = $firebaseObject(usersRef.child(currentUserId));
          //$loaded returns a promise which is resolved when the initial object data
          //has been been downloaded from the database. Promise resolves to the
          //$firebaseObject itself
          user.$loaded(function() {
            //When we are sure the object has been completely
            //loaded from firebase then resolve the promise.
            self.current = user;
            console.log(self.current);
            self.registerUser();
            d.resolve(self.current);
          });
        } else {
          d.resolve();
        }
      //
        return d.promise;
      },


     //when we log in a user
     //we log in with facebook, authenticate with firebase, then create a user object in firebase

     //openFB.login() to facebook
     //if success, facebook returns an accessToken
     //call an api called openFB.api("/me")
     //will return some data to create our user object

     //take our accessToken from the first call
     //use it to authenticate our Firebase
     //call $authWithOAuthToken function on the Firebase authentication object
     //if success, success handler will get called
     //inside success handler, we call getOrCreateUser function
     //we retrieve or create a user in the Firebase database
      loginUser: function () {

        var d = $q.defer();

        self.loadUser().then(function(user) {
          console.log('loaded user');
          if(user) {
            d.resolve(self.current);
          } else {
            console.log("Calling facebook login");
            //will open a window to login via facebook
            openFB.login(
              function (response) {
                console.log(response);
                if(response.status === 'connected') {
                  console.log('Facebook login succeeded');
                  //response will return an accessToken attached
                  var token = response.authResponse.accessToken;
                  console.log('Token: ', token);

                    // the '/me' will give data about the current user
                    // on success it will give me the user data
                    openFB.api({
                      path: '/me',
                      params: {},
                      success: function (userData) {
                        console.log('Got data from facebook about current user');
                        console.log(userData);
                        //
                        // We got details of the current user now authenticate via firebase
                        //
                        console.log('Authenticating with firebase');

                        //firebase auth provided by angular fire takes a reference to a particular firebase node

                        var auth = $firebaseAuth(ref);
                        //call authwithOtoken, tell it the type of access, and then the token
                        auth.$authWithOAuthToken("facebook", token)
                          .then(function(authData) {
                            console.log("Authentication success, logged in as:", authData.uid);
                            console.log(authData);
                            //
                            // We've authenticated, now it's time to either get an existing user
                            // object or create a new one.
                            //
                            usersRef.child(authData.uid)

                              //allows us to return some data if no data is present for this child node
                              .transaction(function(currentUserData) {
                                if(currentUserData === null) {
                                  //
                                  // If the transaction is a success and the current user data is
                                  // null then this is the first time firebase has seen this user id
                                  // so this user is NEW
                                  //
                                  // Any object we return from here will be used as the user data
                                  // in firebase
                                  //
                                  return {
                                    'name' : userData.name,
                                    'profilePic': 'http://graph.facebook.com/' + userData.id + '/picture',
                                    'userId' : userData.id,
                                  };
                                }
                              },
                              function (error, committed) {
                                //
                                // This second function in the transaction clause is always called
                                // whether the user was created or is being retrieved.
                                //
                                // We want to store the userid in localstorage as well as load the user
                                // and store it in the self.current property
                                //
                                $localstorage.set('wingman-user', authData.uid);
                                self.current = $firebaseObject(usersRef.child(authData.uid));
                                self.current.$loaded(function() {
                                  self.registerUser();
                                  //When we are sure the object has been completely
                                  //loaded from firebase then resolve the promise.
                                  d.resolve(self.current);
                                });
                              });
                          })
                          .catch(function(error) {
                            console.error("Authentication failed:", error);
                            //
                            // We've failed to authenticate, show the user an error message.
                            //
                            $ionicPopup.alert({
                              title: "Error",
                              template: "There was an error logging you in with facebook, please try later."
                            });
                            d.reject(error);
                          });

                      },
                      error: function (error) {
                        console.error('Facebook error:' + error.error_description);
                        //
                        // There was an error calling the facebook api to get details abou the
                        // current user. Show the user an error message
                        //
                        $ionicPopup.alert({
                          title: "Facebook error",
                          template: error.error_description
                        });
                        d.reject(error);
                      }
                    });
                } else {
                  console.error('Facebook login failed');
                  //
                  // There was an error authenticating with facebook
                  // Show the user an error message
                  //
                  $ionicPopup.alert({
                    title: "Facebook Error",
                    template: 'Failed to login with Facebook'
                  });
                  d.reject(error);
                }
              },
              {
                scope: 'email' // Comma separated list of permissions to request from facebook
              });
          }
        });
        return d.promise;
      },

      registerUser: function() {
        //console.log('registering user')
        ////kick off the platform web client
        //Ionic.io();
        //
        ////this will give you a fresh user or the previously saved 'current user'
        //var user = Ionic.User.current();
        //
        //
        ////if the user doesn't have an id, you'll need to give it one.
        //if(!user.id) {
        //  user.id = self.current.userId;
        //  user.set('name', self.current.name);
        //  user.set('image', self.current.profilePic);
        //};
        //
        //console.log('persisting user');
        //console.log(user);
        ////persist the user
        //user.save().then(function() {
        //  console.log('saved the user');
        //  var push = new Ionic.Push({
        //    "debug": true,
        //    "pluginConfig": {
        //      "ios": {
        //        "badge": true
        //
        //      },
        //      "android": {
        //        "iconColor": "#343434",
        //        "vibrate": true
        //      }
        //    }
        //
        //
        //  });
        //  console.log('push');
        //  console.log(push);
          //var callback = function (pushToken) {
          //  console.log(pushToken.token);
          //};
          //console.log(self.token);
          //push.register(callback);

          //push.register(function(token) {
          //  console.log("Device token:", token.token);
          //  self.current.deviceToken = self.token;
          //  self.current.$save();
          //});

            //push.register({
            //  canShowAlert: true,
            //  canSetBadge: true,
            //  canPlaySound: true,
            //  canRunActionsOnWake: true,
            //  onNotification: function(notification) {
            //      console.log(notification);
            //      //if(notification["$state"]) {
            //      //  navigator.notification.confirm("You have a new chat - go to it?", function(btn) {
            //      //    if(btn === 1) {
            //      //      $state.go(notification["$state"]);
            //      //    }
            //      //  }, "New Chat!")
            //      //}
            //      return true;
            //  }
            //
            //});

          console.log(self.token);
          self.current.deviceToken = self.token;
          self.current.$save();

        //})
  }


  };

  self.loadUser();


  return self;

});
