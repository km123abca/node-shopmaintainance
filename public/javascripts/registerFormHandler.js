
function validity_check(username,password,password2,email)
	{
		if(username.trim()=="")
			{ 
				showModal_k("Form Error","Invalid/blank username");
				return false;
			}
		if(password.trim()=="" || password2.trim()=="" )
			{
				showModal_k("Form Error","Invalid/blank password");
				return false;
			}
		if(password!=password2)
			{
				showModal_k("Form Error","Passwords dont match");
            return false;
			}
		var regex_var="^[a-z][a-z0-9]*@[a-z]+\.(com|in|org)";
		var re=new RegExp(regex_var,"g");
		if(email.search(re)!=0)
			{
				showModal_k("Form Error","Invalid/blank Email");
				return false;
			}
		return true;
	}


const form=document.getElementById("registerform");
form.addEventListener("submit", 
                               (event)=>
                                 {
                                 	event.preventDefault();
                                 	var formData=new FormData(form);
                                 	let username=formData.get("username");
                                 	let password=formData.get("password");
                                 	let password2=formData.get("password2");
                                 	let email=formData.get("email");
                                 	let shid=formData.get("shid");
                                 	// if(shid=="") formData.set("shid","-1");
                                    if(shid=="") shid=-1;
                                    let data2send={
                                                   "username":username,
                                                   "password":password,
                                                   "email":email,
                                                   "shid":shid,
                                                  };
                                    data2send=JSON.stringify(data2send);

                                 	if(!validity_check(username,password,password2,email))
                                 		return false;
                                    showWait();
                                 	fetch('register',
                                 				     {
                                 				     	method:"POST",
                                 				     	body  :data2send,
                                                   headers: {
                                                            "content-type":"application/json",
                                                            },
                                 				     }
                                 		 )
                                 	.then(response=>response.json())
                                 	.then(
                                 			resp=>
                                 			 {
                                 			 	if(resp.msg=="ok")
                                 			 		{
                                                   haltWait();
                                 			 			// showModal_k("Success",resp.msg+","+resp.msg2);
                                                   window.location.href='/user/login';
                                 			 		}	
                                 			 	else
                                 			 		{
                                                   haltWait();
                                 			 			showModal_k("Error at response",resp.msg+","+resp.msg2);
                                 			 			console.log(resp.msg2);
                                 			 		}
                                 			 }
                                 		 )
                                 	.catch(
                                 		   err=>{
                                                   haltWait();
                                 		   			showModal_k("frontend error",err);
                                 		        }
                                 		);
                                 }
                     );