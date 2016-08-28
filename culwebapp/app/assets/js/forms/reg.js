var RegForm = function () {

    return {

        //Registration Form
        initRegForm: function () {
            // Validation       
            $("#sky-form-register").validate({
                // Rules for form validation
                rules:
	            {
	                username:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                password:
	                {
	                    required: true,
	                    minlength: 6,
	                    maxlength: 20
	                },
	                passwordConfirm:
	                {
	                    required: true,
	                    minlength: 6,
	                    maxlength: 20,
	                    equalTo: '#password'
	                },
	                gender:
	                {
	                    required: true
	                },
	                terms:
	                {
	                    required: true
	                },
	                reference: {
	                    minlength: 5,
	                    maxlength: 5
	                }
	            },

                // Messages for form validation
                messages:
	            {
	                username:
                    {
                        required: '请输入您的用户名'
                    },
	                email:
	                {
	                    required: '请输入您的邮箱地址',
	                    email: '请输入有效的邮箱地址(比如:JonDoe@gmail.com)'
	                },
	                password:
	                {
	                    required: '请输入您的密码',
	                    minlength: '密码长度不能小于{0}',
	                    maxlength: '密码长度不能大于{0}'
	                },
	                passwordConfirm:
	                {
	                    required: '请再次输入您的密码',
	                    equalTo: '您输入的密码和上面的不一致',
	                    minlength: '密码长度不能小于{0}',
	                    maxlength: '密码长度不能大于{0}'
	                },
	                gender:
	                {
	                    required: '请选择性别'
	                },
	                terms:
	                {
	                    required: '您必须同意用户注册协议'
	                },
	                reference: {
	                    minlength: '推荐人的注册帐号为{0}位字符',
	                    maxlength: '推荐人的注册帐号为{0}位字符'
	                }
	            },

                // Do not change code below
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                }

            });
        }

    };
}();