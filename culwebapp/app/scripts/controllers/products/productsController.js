'use strict';

angular
    .module('culwebApp')
    .controller('ProductsCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'SweetAlert',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, SweetAlert) {

            $scope.searchKeyItems = [{
                key: 'productNumber',
                text: '商品编号'
            }];

            var queryPara = $scope.queryPara = {
                searchKeyName: 'productNumber',
                dateRange: 'last6Months',
            };

            $scope.pagedOptions = {
                total: 0,
                size: 10
            }

            $scope.onPaged = function (pageIndex) {
               
            }


            $scope.redirectTo = function () {
                $state.go('customer.productedit')
            }



        }]);