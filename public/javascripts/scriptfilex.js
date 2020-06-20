let focussed_input="none";
function assignFocus(elem)
	{
		focussed_input=elem.id;
	}
function showModal_k(titlemessage="no title",bodymessage="Dang it Kitchu.. Pull yourself together ")
{
 $('#mheader').html(titlemessage);
 $('#mmessage').html(bodymessage);
 $('#mm').modal();
}


function typed(elem)
	{
	// showModal_k("info",elem.innerHTML+" was pressed");	
	
	if(focussed_input=="qty")
	    {    	
 		document.querySelector("#qty").value+=elem.innerHTML;
     	}
    else
    	{
         document.querySelector("#scanid").value+=elem.innerHTML;
         checkWithServer(document.querySelector("#scanid").value);
    	}	

	}
function clearx()
	{
		if(focussed_input=="qty")
		  document.querySelector("#qty").value="";
		else	
		  document.querySelector("#scanid").value="";
	}

function checkProduct(elem)
   {
   	showModal_k(elem.value);
   }

function checkWithServer(new_id)
	{
		if(new_id.length<4)
			 return false;
		fetch('sales/withid',
			                 {
			                 	method:'POST',
			                 	body:JSON.stringify({Product_id:new_id}),
			                 	headers:{
			                 			  "content-type":"application/json",
			                 	        }
			                 }
			 ).then(
			         (response)=>
						          {
						          	
						          	return response.json();
						          }
			       )
			  .then(
			  	     (response)=>{

						  	     if(response.message=="found")
						  	     	{
						  	     	document.querySelector("#itemname").value =response.Product_Name;
						  	     	document.querySelector("#desc").value     =response.Product_Desc;
						  	     	document.querySelector("#qty").value      =1;
						  	     	document.querySelector("#price").value    =response.Product_Price;
						  	     	let stringToPush=`<tr>
						  	     						<td>${response.Product_Name}</td>
														<td>1</td>
														<td>${response.Product_Price}</td>
														<td>${response.Product_Price}</td>
						  	     					  </tr>
						  	     	 `;

						  	     	document.querySelector("#billing-tbody").innerHTML=stringToPush+
						  	     	document.querySelector("#billing-tbody").innerHTML;	
						  	     	document.querySelector("#scanid").value="";
						  	     	document.querySelector("#scanid").focus();
						  	     	}
						  	     else
						  	     	{
						  	     		console.log("item was not found");
						  	     	}
			  	                 }
			  	   )
			  .catch(err=>{
			  	             showModal_k("error",err);
			  	          }
			  	    );
			  
			  
	}


