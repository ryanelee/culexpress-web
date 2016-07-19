'use strict';

angular
    .module('culwebApp')
    .controller('AboutController',['$scope','$http',
    function ($scope,$http) {
        $http.get(cul.apiPath + '/web/client').success(function(data){        
            $scope.Clients = data;
        });
    }
]);