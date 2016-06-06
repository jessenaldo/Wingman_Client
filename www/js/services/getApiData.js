var mod =  angular.module('wingman.services', []);

mod.factory('Api', function($http, ApiEndpoint) {
  console.log('ApiEndpoint', ApiEndpoint);

  var getApiData = function() {
    return $http.get(ApiEndpoint.url + '/requestwingman')
      .then(function(data) {
        console.log('Got some data:', data);
        return data;
    });
  }

  return {
    getApiData: getApiData
  }
});
