function genToken(stat){
	let inpelem=document.querySelector("#"+stat+"token");
	inpelem.value=genOTP();
	sendToServer(stat);
}

function deleteToken(stat){
	let inpelem=document.querySelector("#"+stat+"token");
	inpelem.value="";
}

function genOTP()
	{	strr="";
		for(var i=0;i<6;i++)
			strr+=parseInt(Math.random()*10);
		return strr;
	}

function sendToServer(stat)
	{
		let inpelem=document.querySelector("#"+stat+"token");		
		let priv=(stat=='high')?1:0;
        let elem=inpelem.value;
        // console.log(elem+' will be stored');
		showWait();
		fetch('/user/genToken',
								{
								 method:'POST',
								 body  :JSON.stringify({Tokenstring:elem,priv:priv}),
	                             headers:{
	                                      "content-type":"application/json",
	                                     },
								}
			 ).then(
			 		response=>response.json()
			 ).then(
			        response=>
			        		{
			        			haltWait();
			        			if(response.msg=="ok")
			        				{
			        				showModal_k("Success","Token Successfully Generated, You can use it now");
			        				// console.log(inpelem);
			        				inpelem.select();
									inpelem.setSelectionRange(0, 99999);
									document.execCommand("copy");
									}
								else if(response.msg=="duplicate_error")
									{
										showModal_k("Server says",response.msg2);
									}
			        			else
			        			{
			        				console.log(response.msg);
			        				showModal_k("BackEnd error","Failed to create Token");
			        			}
			        		}
			 ).catch(
				 	err=>{
				 			haltWait();
				 			showModal_k("error at FrontEnd",err);		
				 		 }
			 );
	}



