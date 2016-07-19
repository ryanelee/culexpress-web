'use strict';

angular
    .module('culwebApp')
    .controller('ContactController', ['$scope', '$http', 'OrderSvr',
    function ($scope, $http, orderSvr) {

        ContactForm.initContactForm();
        OwlCarousel.initOwlCarousel();

        $http.get(cul.apiPath + '/web/client').success(function (data) {
            $scope.Clients = data;
        });

        var model = $scope.model = {

        };

        $scope.submitMessage = function () {
            orderSvr
                .saveMessage($scope.$root.currentUser.customerNumber, model.message)
                .then(function (result) {
                    if (result.data) {
                        SweetAlert.swal('提示', '留言成功.');
                    }
                }, function (result) {
                    if (result.data && result.data.message) {
                        SweetAlert.swal('错误', result.data.message, 'error');
                    }
                });
            $scope.model = {};
        }
    }
    ]);