'use strict';

/**
 * @ngdoc overview
 * @name culwebappApp
 * @description
 * # culwebappApp
 *
 * Main module of the application.
 */
angular
    .module('culwebApp', [
        'ngAnimate',
        'ngResource',
        'ui.router'
    ])
    .directive('bindHtmlUnsafe', function($compile) {
        return function($scope, $element, $attrs) {

            var compile = function(newHTML) { // Create re-useable compile function
                newHTML = $compile(newHTML)($scope); // Compile html
                $element.html('').append(newHTML); // Clear and append it
            };

            var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
            // Where the HTML is stored

            $scope.$watch(htmlName, function(newHTML) { // Watch for changes to
                // the HTML
                if (!newHTML) return;
                compile(newHTML); // Compile it
            });

        };
    })
    .filter('sysdate', ['$filter', function($filter) {
        return function(inputText) {
            return $filter('date')(inputText, 'yyyy/MM/dd HH:mm')
        }
    }])
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            if(input == null || input == '') {
                return ''
            }
            else if(input.split(splitChar).length > splitIndex) {
                return input.split(splitChar)[splitIndex];
            } else {
                return ''
            }  
        }
    })
    .factory('loadingSvr', ['$timeout', function($timeout) {
        return {
            hide: function(delay) {
                $timeout(function() {
                    angular.element('#sys-overlay').hide();
                    angular.element('#sys-loading').hide();
                }, delay);
            },
            show: function() {
                $timeout(function() {
                    angular.element('#sys-overlay').show();
                    angular.element('#sys-loading').show();
                });
            }
        }
    }])
    .directive('loading', ['$rootScope', function($rootScope) {
        return {
            templateUrl: '/views/loading.html',
            restrict: 'E',
            scope: {
                ngShow: '='
            }
        };
    }])
    .directive('pagination', ['$rootScope', function($rootScope) {
        return {
            templateUrl: '/views/pagination.html',
            restrict: 'E',
            scope: {
                options: '=',
                onPage: '&',
            },
            link: function($scope, $element, attrs) {
                var options = {},
                    index = $scope.index = 1,
                    startPage = 1,
                    steps = $scope.steps = [1],
                    stepLength = 1;

                $scope.allPageCount = 1;

                $scope.canPrev = false;
                $scope.canNext = true;

                var calculateSteps = function(isNext) {
                    var total = options.total,
                        size = options.size,
                        maxSteps = options.stepSize,
                        pageCount = Math.ceil(total / size);

                    $scope.allPageCount = pageCount;
                    if (maxSteps > pageCount) maxSteps = pageCount || 1;

                    if (isNext && $scope.index + stepLength > maxSteps && $scope.index + stepLength <= pageCount) {
                        startPage++;
                    }
                    if (!isNext && startPage - stepLength >= 1 && $scope.index - stepLength < startPage) {
                        startPage--;
                    }

                    if ($scope.index === 1) {
                        startPage = 1;
                    }
                    if ($scope.index === pageCount) {
                        startPage = pageCount - maxSteps + 1;
                    }
                    steps = [];
                    for (var i = 0, ii = maxSteps; i < ii; i++) {
                        steps.push(startPage + i)
                    }

                    $scope.steps = steps;
                }


                var setPagedButtonStatus = function() {
                    $scope.canNext = pagedCheck.canNext($scope.index);
                    $scope.canPrev = pagedCheck.canPrev($scope.index);
                }


                var pagedCheck = {
                    canNext: function(pageIndex) {
                        return Math.ceil(options.total / options.size) > pageIndex;
                    },
                    canPrev: function(pageIndex) {
                        return pageIndex > 1;
                    }
                }

                var next = function(pageIndex) {
                    var canNext = pagedCheck.canNext(pageIndex - 1);
                    if (canNext) {
                        $scope.index = pageIndex;
                        calculateSteps(true);
                    } else {
                        $scope.index = Math.ceil(options.total / options.size);
                    }
                    // $scope.canPrev = true;
                }

                var prev = function(pageIndex) {
                    var canPrev = pagedCheck.canPrev(pageIndex + 1);
                    if (canPrev) {
                        $scope.index = pageIndex;
                        calculateSteps();
                    } else {
                        $scope.index = 1;
                    }
                    //$scope.canNext = true;
                }


                $scope.paged = function(pageMark) {
                    var prevedIndex = $scope.index;
                    if (typeof pageMark === 'string') {
                        ({
                            next: next,
                            prev: prev,
                        })[pageMark](pageMark === 'next' ? ++$scope.index : --$scope.index);
                    } else if (pageMark > $scope.index) {
                        next(pageMark);
                    } else if (pageMark < $scope.index) {
                        prev(pageMark);
                    }
                    if (prevedIndex !== pageMark) {
                        setPagedButtonStatus();
                        var pagedEvent = $scope.onPage();
                        if (pagedEvent) pagedEvent($scope.index);
                    }
                }

                $scope.$watch('options.total', function(newVal) {
                    //if (newVal && newVal > 0) {
                    options = angular.extend({
                        size: 10,
                        stepSize: 4
                    }, $scope.options);

                    calculateSteps();
                    setPagedButtonStatus();
                    //}
                });


                $scope.$watch('options.index', function(newVal) {
                    if (newVal && newVal > 0) {
                        options = angular.extend({
                            size: 10,
                            stepSize: 4
                        }, $scope.options);

                        $scope.index = options.index;


                        calculateSteps();
                        setPagedButtonStatus();
                    }
                });
            }
        };
    }])
    .factory('SweetAlert', ['$rootScope', function($rootScope) {

        var swal = window.swal;

        //public methods
        var self = {

            swal: function(arg1, arg2, arg3) {
                $rootScope.$evalAsync(function() {
                    if (typeof(arg2) === 'function') {
                        swal(arg1, function(isConfirm) {
                            $rootScope.$evalAsync(function() {
                                arg2(isConfirm);
                            });
                        }, arg3);
                    } else {
                        swal(arg1, arg2, arg3);
                    }
                });
            },
            success: function(title, message) {
                $rootScope.$evalAsync(function() {
                    swal(title, message, 'success');
                });
            },
            error: function(title, message) {
                $rootScope.$evalAsync(function() {
                    swal(title, message, 'error');
                });
            },
            warning: function(title, message) {
                $rootScope.$evalAsync(function() {
                    swal(title, message, 'warning');
                });
            },
            info: function(title, message) {
                $rootScope.$evalAsync(function() {
                    swal(title, message, 'info');
                });
            },
            showInputError: function(message) {
                $rootScope.$evalAsync(function() {
                    swal.showInputError(message);
                });
            },
            close: function() {
                $rootScope.$evalAsync(function() {
                    swal.close();
                });
            }
        };

        return self;
    }])
    .factory('sysHttpInterceptor', ['$q', '$location', 'loadingSvr', 'SweetAlert',
        function($q, $location, loadingSvr, SweetAlert) {
            return {
                'request': function(config) {
                    if (config.url.indexOf('.html') < 0 && config.url.indexOf('excel/check') < 0 && config.url.indexOf('excel/create') < 0) {
                        loadingSvr.show();
                    }
                    var token = sessionStorage.getItem('cul-token') || localStorage.getItem('cul-token');
                    if (token) {
                        config.headers = config.headers || {};
                        config.headers.Token = token;
                    }
                    return config;
                },
                'requestError': function(rejection) {
                    loadingSvr.hide();

                    return $q.reject(rejection);
                },
                'response': function(response) {
                    loadingSvr.hide();

                    return response;
                },
                'responseError': function(rejection, status) {
                    console.log('1234',status);
                    if (status == 401 || rejection.status == 401) {
                        $location.path('/login');
                    } else if (status == 500 || rejection.status == 500) {
                        SweetAlert.swal('错误', '系统异常，请稍后重试！', 'error');
                        loadingSvr.hide();
                        return $q.reject();
                    }else if (rejection.status == 400) {
                        SweetAlert.swal('错误', rejection.data.message, 'error');
                    }

                    loadingSvr.hide();

                    return $q.reject(rejection);
                }
            };
        }
    ])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sysHttpInterceptor');
    }])
    .config(function($locationProvider) {
        //$locationProvider.html5Mode(true);
    })
    .config(['$provide', '$stateProvider', '$urlRouterProvider', function($provide, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: function() {}
            })
            .state('/', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: function() {}
            })
            .state('services', {
                url: '/services',
                templateUrl: 'views/services.html'
            })
            .state('pricing', {
                url: '/pricing',
                templateUrl: 'views/pricing.html'
            })
            .state('howtouse', {
                url: '/howtouse',
                templateUrl: 'views/howtouse.html'
            })
            .state('channelintro', {
                url: '/channelintro',
                templateUrl: 'views/channelintro.html',
                controller: function() {}
            })
            .state('embargo', {
                url: '/embargo',
                templateUrl: 'views/embargo.html'
            })
            .state('refer-a-friend', {
                url: '/refer-a-friend',
                templateUrl: 'views/refer-a-friend.html'
            })
            .state('uploadIDCard', {
                url: '/uploadIDCard',
                templateUrl: 'views/uploadIDCard.html'
            })
            .state('uploadIDCardtw', {
                url: '/uploadIDCardtw',
                templateUrl: 'views/uploadIDCard-tw.html'
            })
            .state('faq', {
                url: '/faq',
                templateUrl: 'views/faq.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'views/contact.html',
                controller: function() {}
            })
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.html',
                controller: function() {}
            })
            .state('links', {
                url: '/links',
                templateUrl: 'views/links.html',
                controller: function() {}
            })
            .state('news', {
                url: '/news',
                templateUrl: 'views/news.html',
                controller: function() {}
            })
            .state('terms', {
                url: '/terms',
                templateUrl: 'views/terms.html'
            })
            .state('jobs', {
                url: '/jobs',
                templateUrl: 'views/jobs.html',
                controller: function() {}
            })
            .state('insuranceinstruction', {
                url: '/insuranceinstruction',
                templateUrl: 'views/terms/insurance_instruction.html',
                controller: function() {}
            })
            .state('appendixlimit', {
                url: '/appendixlimit',
                templateUrl: 'views/terms/appendix_limit.html',
                controller: function() {}
            })
            .state('appendixormd', {
                url: '/appendixormd',
                templateUrl: 'views/terms/appendix_ORMD.html',
                controller: function() {}
            })
            .state('termsenglish', {
                url: '/termsenglish',
                templateUrl: 'views/terms/terms_en.html',
                controller: function() {}
            })
            .state('cashback', {
                url: '/cashback',
                templateUrl: 'views/promotion/cashback.html',
                controller: function() {}
            })
            .state('ordertrack', {
                url: '/ordertrack/:trackingNumber',
                templateUrl: 'views/customer/order_track.html',
                controller: function() {}
            }).
            state('ordertracking', {
                url: '/ordertracking/:trackingNumber',
                templateUrl: 'views/customer/order_tracking.html',
                controller: function() {}
            }).
            state('useractive', {
                url: '/useractive',
                templateUrl: 'views/customer/useractive.html',
                controller: function() {}
            }).
            state('forgetpassword', {
                url: '/forgetpassword',
                templateUrl: 'views/customer/forgetpassword.html',
                controller: function() {}
            }).
            state('resetpassword', {
                url: '/resetpassword',
                templateUrl: 'views/customer/resetpassword.html',
                controller: function() {}
            }).
            state('successpay', {
                url: '/successpay',
                templateUrl: 'views/successpay.html',
            controller: function() {}
            }).
            state('failedpay', {
                url: '/failedpay',
                templateUrl: 'views/failedpay.html',
                controller: function() {}
            });

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/customer/login.html',
                controller: function() {}
            })
            .state('register', {
                url: '/register/:reference',
                templateUrl: 'views/customer/register.html',
                controller: function() {}
            })
            .state('registerVIP', {
                url: '/registervip/:reference',
                templateUrl: 'views/customer/registerVIP.html',
                controller: function() {}
            })
            .state('customer', {
                url: '/customer',
                templateUrl: 'views/customer/myhome.html'
            });
    }])
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        'loadingSvr',
        'AuthService',
        'SweetAlert',
        '$location',
        '$window',
        function($rootScope, $state, $stateParams, loadingSvr, AuthService, SweetAlert, $location, $window) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            loadingSvr.show();

            // $rootScope.$on('autologin', function() {
            //     autologin();
            // });

            $rootScope.goback = function($event) {
                if ($event && $event.stopPropagation) $event.stopPropagation();
                $window.history.back();
            }

            // var autologin = $rootScope.autologin = function(callback) {
            //     var localUserString = AuthService.getStorage(AuthService.userInfoKey),
            //         path = $location.path();
            //     if (localUserString) {
            //         var userData = JSON.parse(localUserString);
            //         var loginData = {
            //             emailAddress: userData.emailAddress,
            //             password: userData.password,
            //             rememberMe: false
            //         };
            //         AuthService
            //             .login(loginData)
            //             .then(function(result) {
            //                 if (result.data) {

            //                     AuthService.clearStorage();
            //                     AuthService.addStorage(angular.extend(result.data, { password: loginData.password }), loginData.rememberMe);

            //                     if (result.headers('Token')) {
            //                         localStorage.setItem('cul-token', result.headers('Token'));
            //                     }

            //                     $rootScope.currentUser = result.data;

            //                     var callbackResult = callback && callback(result.data);
            //                     if (callbackResult !== false) {
            //                         if (path === '/login' || path === '/' || !path) {
            //                             $state.go('customer.myhome');
            //                             $rootScope.isLackProfile = !result.data.firstName || !result.data.lastName;
            //                         }
            //                     }
            //                 }
            //             }, function(result) {
            //                 if (result.data.message) {
            //                     window.console && window.console.error(result.data.message);
            //                     window.localStorage.removeItem('cul-token');
            //                     window.localStorage.removeItem('user_info');
            //                     //SweetAlert.swal('错误', result.data.message, 'error');
            //                 }
            //                 $location.path('/');
            //             });
            //     }
            // }

            // autologin();

            $rootScope.$on('$stateChangeSuccess', function(scope, next, current) {
                setTimeout(function() {
                    $(document.body).scrollTop(0);
                    if ($location.path() === '/') {
                        $('#txtTrackingNumber').val('');
                    }
                    if (AuthService.getUser() && AuthService.getUser().currentUser && AuthService.getUser().emailAddress) {
                        ga('set', 'loginusername', AuthService.getUser().emailAddress);
                    }
                    ga("send", "pageview", { page: $location.path() })
                }, 200);
            });
        }
    ]);