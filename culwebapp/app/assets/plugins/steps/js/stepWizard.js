var StepWizard = function () {

    return {
        initStepWizard: function ($scope) {
            var form = angular.element(".shopping-cart");
            //form.validate({
            //    errorPlacement: function errorPlacement(error, element) { element.before(error); },
            //    rules: {
            //        confirm: {
            //            equalTo: "#password"
            //        }
            //    }
            //});
            //var stepsObj = $compile()($scope);

            return form.children("div").steps({
                headerTag: ".header-tags",
                bodyTag: "section",
                transitionEffect: "fade",
                labels: {
                    previous: '上一步',
                    next: '继续',
                    cancel: '返回',
                    finish: '提交'
                },
                onStepChanging: function (event, currentIndex, newIndex) {
                    // Allways allow previous action even if the current form is not valid!
                    if (currentIndex > newIndex) {
                        return true;
                    }
                    //form.validate().settings.ignore = ":disabled,:hidden";
                    //return form.valid();
                    return true;
                },
                onFinishing: function (event, currentIndex) {
                    //form.validate().settings.ignore = ":disabled";
                    //return form.valid();
                    return true;
                },
                onFinished: function (event, currentIndex) {
                    //alert("Submitted!");
                    $scope.submitOrder && $scope.submitOrder();
                }
            });
        },
        compile: function ($scope, $compile) {
            $compile(this.initStepWizard($scope))($scope);
        }
    };
}();