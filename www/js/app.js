// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('wingman', [
    'ionic',
    'ionic.service.core',
    'ionic.service.push',
    'angularMoment',
    'ngMap',
    'ngCordova',
    'firebase',
    'angularMoment',
    'wingman.controllers.main',
    'wingman.controllers.intro',
    'wingman.controllers.map',
    'wingman.controllers.wingman',
    'wingman.controllers.wingmanchat',
    'wingman.controllers.wingmanhelper',
    'wingman.services',
    'wingman.services.userService',
    'wingman.services.map',
    'wingman.utils'

]);


//  'wingman.filters',
//  'wingman.utils'

//let's you specify a key, associate it with a simple value
//inject this key into various services or controllers
app.constant("FIREBASE_URL", 'placeholder_url');
app.constant("FACEBOOK_APP_ID", 'placeholder_id');
//
//app.constant('ApiEndpoint', {
//  url: 'http://localhost:8100/'
//});

app.run(function($ionicPlatform, $rootScope, $cordovaStatusbar, UserService, $ionicPush, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    //Color the iOS status bar text to white
    if(window.StatusBar) {
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.style(0); //Light
    }
    //console.log('running');
    //var push = new Ionic.Push({
    //  "debug": true
    //});

    //push.register(function(token) {
    //  console.log("Device token:", token.token);
    //  UserService.token = token.token;
    //  console.log(UserService.token);
    //});

    //push.register({
    //  canShowAlert: true,
    //  canSetBadge: true,
    //  canPlaySound: true,
    //  canRunActionsOnWake: true,
    //  onNotification: function(notification) {
    //    console.log(notification);
    //    //if(notification["$state"]) {
    //    //  navigator.notification.confirm("You have a new chat - go to it?", function(btn) {
    //    //    if(btn === 1) {
    //    //      $state.go(notification["$state"]);
    //    //    }
    //    //  }, "New Chat!")
    //    //}
    //    return true;
    //  }
    //
    //});
    //UserService.loadUser().then(function(user) {
    //  console.log(user);
    //});


    //var io = Ionic.io();
    //
    //var push = new Ionic.Push({
    //  "onNotification": function(notification) {
    //    alert('Received push notifications!');
    //  },
    //  "pluginConfig": {
    //    "android": {
    //      "iconColor": "#0000FF"
    //    }
    //  }
    //});
    //var user = Ionic.User.current();
    //
    //if (!user.id) {
    //  user.id = Ionic.User.anonymousId();
    //}
    //
    //user.save();

    //var callback = function(data) {
    //  push.addTokenToUser(user);
    //
    //  user.save();
    //};
    //
    //push.register(callback);


    console.log('registering user');
    $ionicPush.init({
      canShowAlert: false,
      canSetBadge: true,
      canPlaySound: true,
      canRunActionsOnWake: true,
      onNotification: function(notification) {
        console.log(notification);
        console.log(notification._payload);
        console.log(notification._payload.$state);
        if(notification._payload.$state) {
          console.log(navigator);
          navigator.notification.confirm("Someone needs a wingman - go to it?", function(btn) {
            if(btn === 1) {
              $state.go(notification._payload.$state, {param: notification._payload.param});
            }
          }, "New Chat!");
        }
        return true;
      }
    });

    var callback = function(data) {
      console.log(data.token);
      UserService.token = data.token;

    };

    $ionicPush.register(callback);

  });
});


app.config(function ($stateProvider, $urlRouterProvider, FACEBOOK_APP_ID) {
  openFB.init({appId: FACEBOOK_APP_ID});
});


//the uiRouter package comes with Ionic, it's actually a core part of Ionic
app.config(function ($stateProvider, $urlRouterProvider) {

  //even though two individual posts are different because of the id, they will be the same state
  $stateProvider
    .state('intro', {
        url: "/",
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
    })
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })
    .state('tab.map', {
      url: "/map",
      views: {
        'tab-map': {
          templateUrl: 'templates/tabs/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('wingman', {
      url: '/wingman',
      templateUrl: 'templates/wingman.html',
      controller: 'WingmanCtrl'
    })
    .state('wingman-chat', {
      url: '/wchat',
      templateUrl: 'templates/wingmanchat.html',
      controller: 'WingmanChatCtrl'
    })
    .state('wingmanhelper', {
      url: '/wingman/:param',
      templateUrl: 'templates/wingman.html',
      controller: 'WingmanHelperCtrl'
    })
  ;

  //if none of the abovve states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');


});
