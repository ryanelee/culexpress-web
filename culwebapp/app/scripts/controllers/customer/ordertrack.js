'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrdertrackCtrl
 * @description
 * # OrdertrackCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('OrdertrackCtrl', ['$scope', '$stateParams', 'OrderSvr', '$location', '$filter',
        function($scope, $stateParams, orderSvr, $location, $filter) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.isErrorNumber = false;
            $scope.trackingNumber = $stateParams.trackingNumber;
            $scope.isOrderTracking = true; //是否显示订单包裹列表
            $scope.showOutboundDate = false;

            var packageNumberMarks = ['cul', 'cht', 'umi'];
            for (var i = 0, ii = packageNumberMarks.length; i < ii; i++) {
                if ((($scope.trackingNumber || '').toLowerCase().indexOf(packageNumberMarks[i]) === 0)) {
                    $scope.isOrderTracking = false;
                    break;
                }
            }

            $scope.packagesList = [];
            if ($scope.isOrderTracking) {
                if (!$scope.trackingNumber) {
                    alertify.alert('错误', "必须输入订单号");
                } else {
                    orderSvr
                        .getOrderPackageNumber($scope.trackingNumber)
                        .then(function(result) {
                            if (result.data) {
                                $scope.packagesList = result.data;
                                if ($scope.packagesList.length <= 0) $scope.isErrorNumber = true;
                            }
                        }, function() {
                            $scope.isErrorNumber = true;
                        });
                }

            }


            $scope.showTrackInfo = function(packageNumber) {
                $location.path('/ordertrack/' + packageNumber);
            }

            $scope.showTrack = false;
            $scope.orderEventInfo = {
                usedTimeString: '10天20小时',
                outboundDate: new Date(),
                actualWeight: 5,
                transFee: 200,
                paidFee: 200,
                expressName: '中通',
                expressNumber: '123456789',
                payTheWay: '现金支付',
                eventList: [{
                    show: false,
                    code: '109',
                    icon: 'fa-space-shuttle',
                    title: '已送往机场',
                    note: '<div class="row"><div class="col-sm-12">' +
                        '<p class="highlight">航班号:{{orderEventInfo.flightNo}}</p>' +
                        '</div></div>',
                },{
                    show: false,
                    code: '104',
                    icon: 'fa-home',
                    title: '包裹已提货,交由国内物流公司递送',
                    note: '<div class="row"><div class="col-sm-12">' +
                        '<p class="highlight">物流公司:{{orderEventInfo.expressName}}</p>' +
                        '<p class="highlight">物流跟踪号:{{orderEventInfo.expressNumber}}[请到国内物流公司官网使用该跟踪号查询包裹状态]</p>' +
                        '</div></div>',
                }, {
                    show: false,
                    code: '103',
                    icon: 'fa-truck',
                    title: '完成出库操作，发往机场',
                }, {
                    show: false,
                    code: '102',
                    icon: 'fa-dropbox',
                    title: '宝贝已经装袋扫描，出库中',
                    note: ''
                }, {
                    show: false,
                    code: '101',
                    icon: 'fa-cogs',
                    title: '完成称重,已计算出运费',
                    note: '<p>实际重量<span class="highlight">{{orderEventInfo.actualWeight}}磅</span>.</p>',

                }, {
                    show: false,
                    code: '100',
                    icon: 'fa-sort-amount-asc',
                    title: '批量创建线下大客户订单.'
                }]
            };
            if (!$scope.isOrderTracking) {
                orderSvr.getOrderStepList($scope.trackingNumber)
                    .then(function(result) {
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

                        eventList = eventObj.eventList;
                        
                        for (var i = 0, ii = eventList.length; i < ii; i++) {
                            var eventItem = eventList[i],
                                queriedEvent = $filter('filter')(tempEventList, function(queryItem) { return queryItem.code == eventItem.code; });
                            if (!!queriedEvent.length) {
                                eventList[i] = angular.extend(eventItem, queriedEvent[0] || {}, { show: true });
                            } else {
                                eventList[i].icon = 'fa-building-o';
                                eventList[i].title = eventList[i].note;
                            }
                            if (eventItem.code == 103) {
                                $scope.showOutboundDate = true;
                                $scope.orderEventInfo.outboundDate = eventItem.time;
                            }
                            if (eventItem.code == 105) {
                                eventItem.icon = 'fa-bullhorn';
                            }
                        }
                        var has104Steps = $filter('filter')(eventList, function(queryItem) { return queryItem.code == 104; });

                        //如果API已经返回了具体的物流信息，但是eventList里面没有对应的步骤就直接加一个默认的进去
                        if (!(has104Steps || []).length && !!eventObj.expressName && !!eventObj.expressNumber) {
                            eventList = [{
                                show: true,
                                code: '104',
                                icon: 'fa-users',
                                title: '包裹已提货,交由国内物流公司递送',
                                note: '<p class="highlight">物流公司:{{orderEventInfo.expressName}}</p>' +
                                    '<p class="highlight">物流跟踪号:{{orderEventInfo.expressNumber}}</p>',
                            }].concat(eventList);
                        }

                        $scope.orderEventInfo = angular.extend($scope.orderEventInfo, eventObj, { eventList: eventList, outboundDate: $scope.orderEventInfo.outboundDate });

                        $scope.showTrack = true;
                    }, function() {
                        $scope.isErrorNumber = true;
                        $scope.showTrack = false;
                        $scope.showOutboundDate = false;
                    });
            }
        }
    ]);