'use strict';

angular
    .module('culwebApp')
    .controller('AboutController', ['$scope', '$http', 'OrderSvr', 'AuthService',
        function($scope, $http, orderSvr, AuthService) {
            ContactForm.initContactForm();
            OwlCarousel.initOwlCarousel();

            $http.get(cul.apiPath + '/web/client').then(function(data) {
                $scope.Clients = data;
            });

            var model = $scope.model = {

            };

            $scope.submitMessage = function() {
                orderSvr
                    .saveMessage(AuthService.getUser().customerNumber, model.message)
                    .then(function(result) {
                        if (result.data) {
                            alertify.alert('提示', '留言成功!');
                        }
                    }, function(result) {
                        if (result.data && result.data.message) {
                            alertify.alert('错误', result.data.message);
                        }
                    });
                $scope.model = {};
            }
        }
    ]);