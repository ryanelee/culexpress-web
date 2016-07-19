'use strict';

angular
    .module('culwebApp')
    .controller('MyDashboardController', ['$scope', '$rootScope', '$anchorScroll', 'OrderSvr',
        function ($scope, $rootScope, $anchorScroll, orderSvr) {
            $scope.currentUser = $rootScope.currentUser;

            var model = $scope.model = {
                addressList: []
            };

            orderSvr.getWarehouses()
                .then(function (result) {

                    if (!window.sessionStorage.getItem('cache_warehouse')) {
                        window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                    }

                    model.addressList = result.data;
                })

        }
    ]);