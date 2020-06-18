
function showModal_k(titlemessage="no title",bodymessage="Dang it Kitchu.. Pull yourself together ")
{
 $('#mheader').html(titlemessage);
 $('#mmessage').html(bodymessage);
 $('#mm').modal();
}


function typed(elem)
	{
	// showModal_k("info",elem.innerHTML+" was pressed");
	document.querySelector("#scanid").value+=elem.innerHTML;
	checkWithServer(document.querySelector("#scanid").value);

	}
function clearx()
	{
		document.querySelector("#scanid").value="";
	}

function checkProduct(elem)
   {
   	showModal_k(elem.value);
   }

function checkWithServer(new_id)
	{
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
						          	console.log(response);
						          	return response.json();
						          }
			       )
			  .then(
			  	     (response)=>{
						  	     if(response.message=="found")
						  	     	{
						  	     	document.querySelector("#itemname")=response.Product_Name;
						  	     	document.querySelector("#desc")=response.Product_Desc;
						  	     	document.querySelector("#qty")=response.Product_Qty;
						  	     	document.querySelector("#price")=response.Product_Price;
						  	     	}
			  	                 }
			  	   )
			  .catch(err=>{
			  	             showModal_k("error",err);
			  	          }
			  	    );
			  
			  
	}


