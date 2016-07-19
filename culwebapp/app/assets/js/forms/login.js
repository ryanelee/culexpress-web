var LoginForm = function () {

    return {
        
        //Masking
        initLoginForm: function () {
	        // Validation for login form
	        $("#sky-form1").validate({
	            // Rules for form validation
	            rules:
	            {
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
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                email:
	                {
	                    required: '请输入注册时填入的邮箱地址',
	                    email: '请输入有效的邮箱地址(比如:JonDoe@gmail.com)'
	                },
	                password:
	                {
	                    required: '请输入您的密码',
	                    minlength: '密码长度不能小于{0}',
	                    maxlength: '密码长度不能大于{0}'
	                }
	            },                  
	            
                // Ajax form submition  
                /*
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    success: function(responseText, statusText, xhr, $form)
	                    {
	                        $("#sky-form1").addClass('submited');
	                    }
	                });
	            },     
                */
                
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
	        
	        // Validation for recovery form
	        $("#sky-form2").validate({
	            // Rules for form validation
	            rules:
	            {
	                email:
	                {
	                    required: true,
	                    email: true
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                email:
	                {
	                    required: '请输入注册时填入的邮箱地址',
	                    email: '请输入有效的邮箱地址(比如:JonDoe@gmail.com)'
	                }
	            },
	                                
	            // Ajax form submition                  
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    success: function()
	                    {
	                        $("#sky-form2").addClass('submited');
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