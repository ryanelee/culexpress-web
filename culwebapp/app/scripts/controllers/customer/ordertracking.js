'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrdertrackCtrl
 * @description
 * # OrdertrackCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('OrdertrackingCtrl', ['$scope', '$stateParams', '$timeout', 'OrderSvr', '$location', '$filter',
        function ($scope, $stateParams, $timeout, orderSvr, $location, $filter) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.isErrorNumber = false;
            $scope.trackingNumber = $stateParams.trackingNumber;
            $scope.isOrderPackage = true;//是否显示订单包裹列表
            $scope.showOutboundDate = false;

            var packageNumberMarks = ['cht', 'umi'];
            for (var i = 0, ii = packageNumberMarks.length; i < ii; i++) {
                if ((($scope.trackingNumber || '').toLowerCase().indexOf(packageNumberMarks[i]) === 0)) {
                    $scope.isOrderPackage = false;
                    break;
                }
            }

            $scope.packagesList = [];
            if ($scope.isOrderPackage) {
                if (!$scope.trackingNumber) {
                    //    alertify.alert('提示', '必须输入运单号');
                       $scope.isErrorNumber = 1;
                } else {
                    orderSvr
                        .getOrderPackageNumber($scope.trackingNumber)
                        .then(function (result) {
                            if (result.data) {
                                $scope.packagesList = result.data;
                                if ($scope.packagesList.length <= 0) {
                                    $scope.isErrorNumber = true;
                                } else {

                                }
                            }
                        }, function () {
                            $scope.isErrorNumber = true;
                        });
                }

            }


            $scope.showTrackInfo = function (packageNumber) {
                $location.path('/ordertracking/' + packageNumber);
            }

            $scope.showTrack = false;

            $scope.showTrack = false;
            $scope.orderEventInfo = {
                eventList: [{
                    code: '105',
                    icon: 'fa-bullhorn'
                }, {
                    code: '104',
                    icon: 'fa-home',
                }, {
                    code: '103',
                    icon: 'fa-truck',
                }, {
                    code: '102',
                    icon: 'fa-dropbox',
                }, {
                    code: '101',
                    icon: 'fa-cogs',

                }, {
                    code: '100',
                    icon: 'fa-sort-amount-asc',
                }]
            };

            if (!$scope.isOrderPackage) {
                orderSvr.getOrderTrackingList($scope.trackingNumber)
                    .then(function (result) {
                        var eventObj = result.data,
                            eventList = [],
                            tempEventList = angular.copy($scope.orderEventInfo.eventList);
                        if (angular.isArray(eventObj)) {
                            eventObj = eventObj[0];
                        }
                        if (!eventObj) {
                            $scope.isErrorNumber = true;
                            return;
                        }

                        eventList = eventObj.data;

                        for (var i = 0, ii = eventList.length; i < ii; i++) {
                            var eventItem = eventList[i],
                                queriedEvent = $filter('filter')(tempEventList, function (queryItem) { return queryItem.code == eventItem.eventCode; });
                            if (!!queriedEvent.length) {
                                eventList[i] = angular.extend(eventItem, queriedEvent[0] || {}, { show: true });
                            }

                            if (eventItem.code == 103) {
                                $scope.showOutboundDate = true;
                                $scope.orderEventInfo.outboundDate = eventItem.time;
                            }
                        }
                        $scope.orderEventInfo = angular.extend($scope.orderEventInfo, eventObj, { eventList: eventList, outboundDate: $scope.orderEventInfo.outboundDate });

                        $scope.showTrack = true;
                    }, function () {
                        $scope.isErrorNumber = true;
                        $scope.showTrack = false;
                        $scope.showOutboundDate = false;
                    });
            }
        }]);
