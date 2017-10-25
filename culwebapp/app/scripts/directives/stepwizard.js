'use strict';

/**
 * @ngdoc directive
 * @name culwebApp.directive:stepWizard
 * @description
 * # stepWizard
 */
angular.module('culwebApp')
    .directive('stepWizard', ['$rootScope', '$state',
        function ($rootScope, $state) {
            return {
                templateUrl: '/views/stepwizard.html',
                transclude: true,
                restrict: 'E',
                scope: {
                    options: '=', 
                    onNext: '&',
                    onPrev: '&',
                    onSubmit: '&',
                    onValid: '&'
                },
                link: function ($scope, $element, attrs) {
                    var options = angular.extend($scope.options, {}),
                        container = $element.find('.wizard-wrap'),
                        wizards = container.find('.wizard'),
                        wizardSteps = wizards.find('li'),
                        viewport = container.find('.viewport'),
                        steps = viewport.children('li'),
                        btnPrev = container.find('footer .btn-prev'),
                        btnNext = container.find('footer .btn-next'),
                        btnSubmit = container.find('footer .btn-submit'),
                        btnBack = container.find('footer .route-back'),
                        totalCount = wizardSteps.length,
                        currentIndex = 1;

                    if (!!btnBack && btnBack.length > 0) {
                        btnBack.on('click', function (e) {
                            if (!!e.stopPropagation) e.stopPropagation();
                            //$state.go('customer.shippingnoticelist');
                            $rootScope.goback(e);
                            return false;
                        });
                    }

                    if (!$rootScope.wizardOptions) $rootScope.wizardOptions = {};

                    if ($rootScope.wizardOptions.wizardStep) currentIndex = $rootScope.wizardOptions.wizardStep;

                    var activeStep = function () {
                        var activeItems = wizards.find('.active'),
                            stepId = $(wizardSteps.get(currentIndex - 1)).data('step');
                        if (activeItems.length === 1) {
                            activeItems.removeClass('complete');
                            stepId = activeItems.data('step');
                            currentIndex = stepId;
                        } else if (activeItems.length === 0) {
                            wizards.removeClass('step1').removeClass('step2').removeClass('step3').addClass('step'+currentIndex);
                            $(wizardSteps.get(currentIndex - 1)).addClass('active');
                        } else {

                        }

                        if ($rootScope.wizardOptions.wizardComplete) {
                            for (var i = 1, ii = $rootScope.wizardOptions.wizardComplete; i < ii; i++) {
                                $(wizardSteps.get(i - 1)).removeClass('active').addClass('complete').find('.number').find('span').html('<i class="fa fa-check"></i>');
                            }
                        }


                        viewport.find('.step-' + stepId.toString()).show();
                    }

                    var canPrev = function () {
                        return currentIndex > 1;
                    }

                    var canNext = function () {
                        return currentIndex < totalCount;
                    }

                    var canSubmit = function () {
                        return currentIndex === totalCount;
                    }

                    var next = function () {
                        if (canNext()) {
                            viewport.find('.step-' + currentIndex.toString()).hide();
                            currentIndex++;
                            wizards.find('.active').addClass('complete').find('.number').find('span').html('<i class="fa fa-check"></i>');
                            wizards.find('.active').removeClass('active');
                            wizards.removeClass('step1').removeClass('step2').removeClass('step3').addClass('step'+currentIndex);
                            wizardSteps.eq(currentIndex - 1).addClass('active');
                            activeStep();
                            initFooterButtomStatus();
                        }
                    }


                    var prev = function () {
                        if (canPrev()) {
                            viewport.find('.step-' + currentIndex.toString()).hide();
                            currentIndex--;
                            wizards.find('.active').addClass('complete').find('.number').find('span').html('<i class="fa fa-check"></i>');
                            wizards.find('.active').removeClass('active');
                            wizards.removeClass('step1').removeClass('step2').removeClass('step3').addClass('step'+currentIndex);
                            wizardSteps.eq(currentIndex - 1).addClass('active');
                            activeStep();
                            initFooterButtomStatus();
                        }
                    }

                    var jumpTo = function (index, callback, preJump) {
                        if (index !== currentIndex) {
                            var preResult = preJump && preJump();
                            if (preResult === false) return false;
                            viewport.find('.step-' + currentIndex.toString()).hide();
                            wizards.find('.active').addClass('complete').find('.number').find('span').html('<i class="fa fa-check"></i>');
                            wizards.find('.active').removeClass('active');
                            wizards.removeClass('step1').removeClass('step2').removeClass('step3').addClass('step'+currentIndex);
                            wizardSteps.eq(index - 1).addClass('active');
                            activeStep();
                            initFooterButtomStatus();

                            callback && callback(wizardSteps);
                        }
                    }

                    $scope.options.jumpTo = jumpTo;
                    $scope.options.next = next;
                    $scope.options.prev = prev;


                    var initFooterButtomStatus = function () {
                        var statusMode = options.mode || 'hidden';
                        if (statusMode === 'hidden') {
                            btnPrev.css({
                                display: canPrev() ? '' : 'none'
                            });
                        } else if (statusMode === 'disable') {
                            btnPrev.attr({
                                disabled: !canPrev()
                            });
                            btnNext.attr({
                                disabled: !canNext()
                            });
                        }
                        //这里有个始终显示两个按钮的逻辑，所向下按钮在最后一个步骤的时候需要隐藏掉
                        btnNext.css({
                            display: canNext() ? '' : 'none'
                        });
                        btnSubmit.css({
                            display: canSubmit() ? '' : 'none'
                        });
                    }

                    var eventInvoke = function (eventMethod, callback) {
                        var verifiedMethod = $scope.onValid(),
                            currentStep = viewport.find('.step-' + currentIndex.toString()),
                            currentTitle = $(wizardSteps.get(currentIndex - 1)),
                            verified;
                            verifiedMethod(currentIndex, currentStep, function(err,result){
                                if(err){
                                    console.info('step' + currentIndex + '自定义验证没有通过。');
                                }else{
                                    eventMethod && eventMethod();
                                    callback && callback();
                                }
                            });
                            // verified = verifiedMethod && verifiedMethod(currentIndex, currentStep, currentTitle);
                        // if (verified !== false) {
                        //     eventMethod && eventMethod();
                        //     callback && callback();
                        // } else {
                        //     console.info('step' + currentIndex + '自定义验证没有通过。');
                        // };
                    }



                    var initEvent = function () {
                        btnNext.on('click', function (event) {
                            eventInvoke(next, function () {
                                var customNext = $scope.onNext();
                                customNext && customNext();
                            });
                            $rootScope.wizardOptions.wizardStep = currentIndex;
                            $rootScope.wizardOptions.wizardComplete = currentIndex;
                            event.stopPropagation && event.stopPropagation();
                            return false;
                        });
                        btnPrev.on('click', function () {
                            prev();

                            var customPrev = $scope.onPrev();
                            customPrev && customPrev();
                            $rootScope.wizardOptions.wizardStep = currentIndex;
                            return false;
                        });
                        btnSubmit.on('click', function () {
                            eventInvoke(null, function () {
                                var customSubmit = $scope.onSubmit();
                                customSubmit && customSubmit();
                            });
                            return false;
                        });
                    }

                    var initSteps = function () {
                        wizardSteps.each(function (i, el) {
                            if (!$(this).data('step')) {
                                $(this).data('step', (i + 1));
                            }

                            if ($scope.options.sequenced !== false) {
                                if (!$(this).hasClass('hide')) {
                                    $(this).prepend('<div class="number"><span>' + (i + 1) + '</span></div>');
                                }
                            }
                        });

                        steps.hide();
                        steps.each(function (i, el) {
                            $(this).addClass('step-' + (i + 1).toString());
                        });
                        activeStep();
                    }

                    var initOptions = function () {
                        if (options.nextText) {
                            btnNext.text(options.nextText);
                        }
                        if (options.prevText) {
                            btnPrev.text(options.prevText);
                        }
                        if (options.submitText) {
                            btnSubmit.text(options.submitText);
                        }
                    }

                    var init = function () {
                        initSteps();
                        initFooterButtomStatus();
                        initEvent();
                        initOptions();
                    }
                    init();
                }
            };
        }
    ]);
