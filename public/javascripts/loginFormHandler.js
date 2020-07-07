function loginValidity(username,password)
	{
		if( username.trim()=="" || password.trim()=="")
		{
			showModal_k("error","Username/Password is empty");
			return false;
		}
      return true;
	}


const form=document.getElementById("loginform");
form.addEventListener("submit", 
                               (event)=>
                                 {
                                 	event.preventDefault();                                   
                                 	var formData=new FormData(form);
                                 	let password=formData.get("password");                                 	
                                 	let email=formData.get("email");

                                 	let data2send={
                                                   "email":email,
                                                   "password":password,                                                   
                                                  };
                                    data2send=JSON.stringify(data2send);
                                    if(!loginValidity(email,password))
                                    	return false;
                                    showWait();
                                    
                                    fetch('/user/login',
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
                                                   window.location.href='/inventory';
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