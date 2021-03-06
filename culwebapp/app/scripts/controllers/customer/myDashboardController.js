'use strict';

angular
    .module('culwebApp')
    .controller('MyDashboardController', ['$scope', '$http', '$rootScope', '$anchorScroll', 'OrderSvr', 'AuthService',
        function($scope, $http, $rootScope, $anchorScroll, orderSvr, AuthService) {

            AuthService.getCustomerMessage({ customerNumber: $rootScope.currentUser.customerNumber }).then(function(result) {
                $scope.currentUser = result.data
            })
            var model = $scope.model = {
                addressList: []
            };

            $scope.toggle = function(id) {
                $('#' + id).toggle();
            }

            orderSvr.getWarehouses()
                .then(function(result) {
                    if (!window.sessionStorage.getItem('cache_warehouse')) {
                        window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                    }
                    model.addressList = result.data;
                    model.addressList.forEach(function(e) {
                        if (e.warehouseName.indexOf('CA') >= 0) {
                            e.warehouseName = "美国加州仓库"
                        }
                        if (e.warehouseName.indexOf('DE') >= 0) {
                            e.warehouseName = "美国特拉华仓库"
                        }
                        if (e.warehouseName.indexOf('OR') >= 0) {
                            e.warehouseName = "美国俄勒冈仓库"
                        }
                    })
                })

            //登入普通广告管理
            $scope.primAnnounceList = [{
                title: "",
                content: ""
            }];
            $scope.getPrimAnnounce = function() {
                var objPrim = { type: 2, status: 1, openAll: 0 };
                $http.post(cul.apiPath + '/web/WebAnnounce', objPrim).then(function(result) {
                    $scope.primAnnounceList = result.data.data.data;
                });
            }
            $scope.getPrimAnnounce();

            //登入促销活动管理
            $scope.proAnnounceList = [{
                title: "",
                content: "",
                openTime: ""
            }];

            $scope.getProAnnounce = function() {
                var objPro = { type: 3, status: 1, openAll: 0 };
                $http.post(cul.apiPath + '/web/WebAnnounce', objPro).then(function(result) {
                    $scope.proAnnounceList = result.data.data.data;
                });
            }
            $scope.getProAnnounce();

            $scope.setStyle = function() {
                if ($scope.proAnnounceList.length > 0) return 'col-sm-6';
                else {
                    return 'col-sm-12';
                }
            };

        }
    ]);