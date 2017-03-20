'use strict';

angular
    .module('culwebApp')
    .controller('MyDashboardController', ['$scope', '$rootScope', '$anchorScroll', 'OrderSvr',
        function ($scope, $rootScope, $anchorScroll, orderSvr) {
            $scope.currentUser = $rootScope.currentUser;
            console.log( $scope.currentUser);

            var model = $scope.model = {
                addressList: []
            };

            $scope.toggle = function (id) {
                $('#' + id).toggle();
            }

            orderSvr.getWarehouses()
                .then(function (result) {
                    if (!window.sessionStorage.getItem('cache_warehouse')) {
                        window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                    }
                    model.addressList = result.data;
                     model.addressList.forEach(function(e){
                          if(e.warehouseName.indexOf('CA')>=0){
                              e.warehouseName = "美国加州仓库"
                          }
                           if(e.warehouseName.indexOf('DE')>=0){
                              e.warehouseName = "美国特拉华仓库"
                          }
                           if(e.warehouseName.indexOf('OR')>=0){
                              e.warehouseName = "美国俄勒冈仓库"
                          }
                     })
                })

        }
    ]);
