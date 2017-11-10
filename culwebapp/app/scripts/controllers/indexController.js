'use strict';

angular 
    .module('culwebApp') 
    .controller('IndexController', ['$rootScope', '$scope', '$location', 'AuthService', '$http', 'Customer','$state',
        function($rootScope, $scope, $location, AuthService, $http, Customer, $state) {
            // if (!$rootScope.currentUser) {
            $rootScope.currentUser = AuthService.getUser();
            // };

            $scope.notice =   window.sessionStorage.getItem("notice")
            // console.log("客户编号：" + $rootScope.currentUser.customerNumber);
            $scope.logout = function() {
                AuthService.logout(function() {
                    $scope.isLogin();
                    $location.path('/login');
                });
            };
            $scope.isLogin = function() {
                $scope.isLogined = AuthService.isLogined();
            }
            $scope.isLogined = AuthService.isLogined();
            $scope.$on('isLogin', function() {
                $scope.isLogin();
                $rootScope.currentUser = AuthService.getUser();
                $scope.getMessageOperationlog();
            })

            $scope.tipMessageList = [];
            $scope.tipMessageLength = 0;
            $scope.authType = "";
            $scope.authTypeSref = "";

            $scope.getMessageOperationlog = function() {
                Customer.getMessageOperationlog().then(function(data) {
                    console.log("data-->",data)
                    $scope.tipMessageList = data.data.data;
                    $scope.tipMessageLength = data.data.data.length;
                })
            }
            if ($scope.isLogined) {
                $scope.getMessageOperationlog();
            }
 

            // $scope.load = function() {  
            //     $scope.tipMessageLength = $scope.tipMessageList.length;  
            // }
            $scope.getDetail = function(item) {
                Customer.updateMessageOperation({ messageNumber: item.messageNumber }).then(function(data) {
                    $location.path('customer/question/' + item.messageNumber)
                })
            }

            $scope.jobs = function() {
                // if (!$scope.isLogin()) {
                //     $location.path('/login');
                // } else {
                $location.path('/jobs');

                // }
            }
            $scope.terms = function() {
                // if (!$scope.isLogin()) {
                //     $location.path('/login');
                // } else {
                $location.path('/terms');
                // }
            }

            $scope.btnViewMessageList = function() {
                $location.path('customer/myquestions');
            }

            // $http.get(cul.apiPath + '/web/reference').then(function (data) {
            //     $scope.References = data;
            // });

            $scope.$on('$routeChangeSuccess', function(scope, next, current) {
                $(document.body).scrollTop(0);
                if ($location.path() === '/') {
                    $('#txtTrackingNumber').val('');
                }
            });

             $scope.authTypeChange = function (authType) {
                 if (authType == "1") {
                    $scope.authTypeSref = "uploadIDCard"
                    $state.go("uploadIDCard");
                 } else {
                    $scope.authTypeSref = "uploadIDCardtw"
                    $state.go("uploadIDCardtw");
                 }
             }

             //弹出广告管理
            $scope.webAnnounce = [{
                title: "",
                content: ""
            }];
            $scope.getWebAnnounce = function() {
                var obj = { type: 4, status: 1, openAll: 1 };
                $http.post(cul.apiPath + '/web/WebAnnounce', obj).then(function(result) {
                    $scope.webAnnounce = result.data.data.data;
                    if($scope.webAnnounce[0]){
                        if ($scope.webAnnounce[0].status == 1) {
                            console.log('$scope.webAnnounce[0].status == 1');
                            console.log("$scope.notice",$scope.notice)
                            if(!$scope.notice){
                                console.log(23)
                                $('#modalNote').modal('show');
                            }
                        }
                    }
                });
            }
            $scope.getWebAnnounce();

            //登入普通广告管理
            $scope.primAnnounceList = [{
                title: "",
                content: ""
            }];
            $scope.getPrimAnnounce = function () {
                var objPrim = { type: 2, status: 1, openAll: 0 };
                $http.post(cul.apiPath + '/web/WebAnnounce', objPrim).then(function (result) {
                    $scope.primAnnounceList = result.data.data.data;
                });
            }
            $scope.getPrimAnnounce();

            $scope.noRemeber = function(){
                if($scope.rememberMe){
                    window.sessionStorage.setItem("notice",false)
                }else{
                    window.sessionStorage.setItem("notice",true)
                }
                console.log( window.sessionStorage.getItem("notice"))
            }



        }
    ]);