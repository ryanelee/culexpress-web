'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderdetailCtrl
 * @description
 * # OrderdetailCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
  .controller('OrderdetailCtrl', ['$scope', 'OrderSvr', '$stateParams', '$state', '$location', 'SweetAlert',
      function ($scope, orderSvr, $stateParams, $state, $location, SweetAlert) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          var orderId = $stateParams.id;

          $scope.data = {};
          if (orderId) {
              orderSvr
                  .getOrderInfo(orderId)
                  .then(function (result) {
                      $scope.data = result.data;

                      loadOrderMessage();
                  });
          }

          $scope.redirectToTrack = function () {
              if (orderId) {
                  $location.path('/ordertracking/' + orderId);
              }
          }

          $scope.submitMessage = function () {
              if ($scope.data.orderMessage) {
                  orderSvr
                      .saveMessage($scope.data.orderMessageNumber, $scope.data.orderMessage)
                      .then(function (result) {
                          if (result.data) {
                              SweetAlert.swal('提示', '留言成功.');
                              loadOrderMessage();
                          }
                      }, function (result) {
                          if (result.data && result.data.message) {
                              SweetAlert.swal('错误', result.data.message, 'error');
                          }
                      });

              }
          }
          $scope.orderMessages = [];
          var loadOrderMessage = function () {
              orderSvr
                  .getMessage($scope.data.orderMessageNumber)
                  .then(function (result) {
                      if (result.data) {
                          $scope.orderMessages = result.data.messageLogs;
                      }
                  })

          }

          $scope.deleteOrder = function (number) {
              if (!number) return false;

              SweetAlert.swal({
                  title: "确定要取消订单[" + number + "]?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  cancelButtonText: "放弃",
                  closeOnConfirm: false
              }, function (isConfirm) {
                  if (isConfirm) {
                      orderSvr.deleteOrder(number)
                          .then(function (result) {
                              if (result.data.success) {
                                  SweetAlert.swal('提示', '取消成功.', 'success');
                                  returnToOrderList();
                              }
                          }, function (result) {
                              if (result.data.message) {
                                  SweetAlert.swal('错误', result.data.message, 'error');
                                  returnToOrderList();
                              }
                          });
                  }
              });
          }

          $scope.payOrder = function (orderItem) {
              if (!orderItem) return false;
              if (!orderItem.totalCount) {
                  SweetAlert.swal('提示', '订单还未计价,不能支付!', 'warning');
                  return false;
              }

              if ($scope.$root.currentUser.accountBalance < orderItem.totalCount) {
                  SweetAlert.swal('提示', '您需要支付' + orderItem.totalCount + '元，但您的余额已不足，为' + $scope.$root.currentUser.accountBalance + ',请先充值!', 'warning');
                  return false;
              }

              SweetAlert.swal({
                  title: "您将被扣款" + orderItem.totalCount + "元，确定支付订单?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  closeOnConfirm: false
              }, function (isConfirm) {
                  if (isConfirm) {
                      $('.sa-confirm-button-container button.confirm').attr({ disabled: true });

                      var currentUser = $scope.$root.currentUser;

                      orderSvr.paymentOrder(orderItem.orderNumber)
                          .then(function (result) {
                              if (result.data.success) {
                                  SweetAlert.swal('提示', '支付成功.', 'success');

                                  //支付之后刷新一下全局余额
                                  $scope.$root.autologin(function (result) {
                                      if (currentUser) {
                                          currentUser.accountBalance = result.accountBalance;
                                      }
                                      return false;
                                  });


                                  returnToOrderList();
                              }

                          }, function (result) {
                              if (result.data.message) {
                                  SweetAlert.swal('错误', result.data.message, 'error');
                              }
                          });

                  }
              });
          }


          var returnToOrderList = function () {
              $state.go('customer.myorders');
          }



          $scope.redirectToAddressInfo = function (addressItem) {
              $state.go('customer.myaddress', { addressId: addressItem.transactionNumber });
          }

      }]);
