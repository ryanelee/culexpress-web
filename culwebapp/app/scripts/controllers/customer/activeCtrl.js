'use strict';

angular
    .module('culwebApp')
    .controller('activeCtrl', ['$scope', '$location', '$compile', '$timeout', '$state', '$stateParams', '$filter', '$http', 'SweetAlert', 'Customer',
        function ($scope, $location, $compile, $timeout, $state, $stateParams, $filter, $http, SweetAlert, Customer) {
            var model = $scope.model = {
                actived: true
            };

            $http.post(cul.apiPath + '/user/active', {
                uuid: $location.search().uid,
                emailAddress: $location.search().mail
            })
            .then(function (result) {
                if (!!result.data.scuess) {
                    $scope.model.actived = true;
                }
            }, function () {
                $scope.model.actived = false;
            });

        }])