var ContactForm = function () {

    return {

        //Contact Form
        initContactForm: function () {
	        // Validation
	        $("#sky-form3").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
                  tell:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
                  address:
	                {
	                    required: true
	                },
	                message:
	                {
	                    required: true,
	                    minlength: 10
	                },
	                captcha:
	                {
	                    required: true,
	                    remote: 'assets/plugins/sky-forms-pro/skyforms/captcha/process.php'
	                }
	            },

	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: '请输入您的姓名',
	                },
                  tell:
	                {
	                    required: '请输入您的电话',
	                },
	                email:
	                {
	                    required: '请输入您的邮箱地址',
	                    email: '请输入有效的邮箱地址比如jon.doe@abc.com'
	                },
                  address:
	                {
	                    required: '请输入您的地址',
	                },
	                message:
	                {
	                    required: '请输入您的留言内容'
	                },
	                captcha:
	                {
	                    required: 'Please enter characters',
	                    remote: 'Correct captcha is required'
	                }
	            },

	            // Ajax form submition
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    beforeSend: function()
	                    {
	                        $('#sky-form3 button[type="submit"]').attr('disabled', true);
	                    },
	                    success: function()
	                    {
	                        $("#sky-form3").addClass('submited');
	                    }
	                });
	            },

	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
