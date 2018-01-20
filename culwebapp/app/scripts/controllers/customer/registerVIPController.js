'use restrict';


angular
    .module('culwebApp')
    .controller('RegisterVIPController', ['$rootScope', '$scope','$location', '$state', '$stateParams','AuthService',
    function ($rootScope, $scope, $location, $state, $stateParams, AuthService) {

        $scope.userType = AuthService.userTypes.culwebapp_user;
        $scope.registerError = '';
        $scope.showRegisterError = false;
        $scope.customerNumber = $stateParams.reference || '';
        $scope.model = {
            registed: false,
            email: ''
        };

        if ($stateParams.reference !== undefined){
            $scope.customerNumber = $stateParams.reference;
        }

        $scope.ck = function(key) {
          switch (key) {
            case 'userName':
              if (!$scope.userName) {
                $scope['userNameErr'] = '请输入您的商家用户名';
              } else {
                $scope['userNameErr'] = '';
              }
              break;
            case 'gender':
              if (!$scope.gender) {
                $scope['genderErr'] = '请选择性别';
              } else {
                $scope['genderErr'] = '';
              }
              break;
            case 'emailAddress':
              if (!$scope.emailAddress) {
                $scope['emailAddressErr'] = '请输入您的邮箱地址';
              } else {
                if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test($scope.emailAddress)) {
                  $scope['emailAddressErr'] = '请输入有效的邮箱地址(比如:JonDoe@gmail.com)';
                } else {
                  $scope['emailAddressErr'] = '';
                }
              }
              break;
            case 'password':
              if (!$scope.password) {
                $scope['passwordErr'] = '请输入您的密码';
              } else {
                if ($scope.password.length < 6 || $scope.password.length > 20) {
                  $scope['passwordErr'] = '密码长度为6-20位';
                } else {
                  $scope['passwordErr'] = '';
                }

                if ($scope.passwordConfirm && $scope.password) {
                  if ($scope.password !== $scope.passwordConfirm) {
                    $scope['passwordConfirmErr'] = '两次密码输入不一致';
                  } else {
                    $scope['passwordConfirmErr'] = '';
                  }
                }
              }
              break;
            case 'passwordConfirm':
              if (!$scope.passwordConfirm || $scope.password !== $scope.passwordConfirm) {
                $scope['passwordConfirmErr'] = '两次密码输入不一致';
              } else {
                $scope['passwordConfirmErr'] = '';
              }
              break;
            case 'reference':
              if (!$scope.customerNumber) {
                $scope['referenceErr'] = '请输入您的商家用户邀请码';
              } else {
                $scope['referenceErr'] = '';
              }
              break;
            default:
              break;
          }
        }

        $scope.register = function () {
          console.log($scope.customerNumber);
          $scope.ck('reference');
          $scope.ck('userName');
          $scope.ck('gender');
          $scope.ck('emailAddress');
          $scope.ck('password');
          $scope.ck('passwordConfirm');
          

          // 注册协议
          if (!$scope.terms) {
            $scope.showRegisterError = true;
            $scope.registerError = '您必须勾选同意商家用户注册协议';
          } else {
            $scope.showRegisterError = false;
            $scope.registerError = '';
          }

          if ($scope.userNameErr || $scope.genderErr || $scope.emailAddressErr 
            || $scope.passwordErr || $scope.passwordConfirmErr || $scope.showRegisterError || $scope.referenceErr ) {
            return false;
          }

            var registerData = {
                userName: $scope.userName,
                password: $scope.password,
                emailAddress: $scope.emailAddress,
                gender: $scope.gender,
                reference: $scope.customerNumber,
                userType: AuthService.userTypes.culwebapp_user,
                countryCode: 'USA'
            };


            var key = CryptoJS.lib.WordArray.random(128 / 8);

            var bodyData = {
                data: CryptoJS.AES.encrypt(JSON.stringify(registerData), key.toString()).toString(),
                key: key.toString()
            };

            AuthService.register(registerData,function(user){
              if (!!user) {
                  $scope.model.registed = true;
                  $scope.model.email = registerData.emailAddress;
              }
            },function(err) {
              $scope.showRegisterError = true;
              $scope.registerError = err.data.message;
            })
        };
    }
    ]);
