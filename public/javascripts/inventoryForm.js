const form=document.getElementById("inventory-form");
//const form = document.querySelector("form");
form
.addEventListener("submit", 
	                      (event) => 
	                        {
	                        	event.preventDefault();
	                        	const formData = new FormData(form);
	                        	const Product_id=formData.get("Product_id");
	                        	const Product_Name=formData.get("Product_Name");
	                        	const Product_Desc=formData.get("Product_Desc");
	                        	const Product_Qty=formData.get("Product_Qty");
	                        	const Product_Price=formData.get("Product_Price");
	                        	const Product_Image=formData.get("Product_Image");
	                        	console.log(`${Product_Name} will be stored`);
	                        	showWait();
	                        	fetch('/inventory',
	                        		               {
	                        		               	method:"POST",
	                        		               	body:formData,
	                        		               	// headers: {
	                        		               	// 		   "content-type":"multipart/form-data",
	                        		               	// 		 },
	                        		               }	                        		               
	                        		 )
	                        	.then(response=>response.json())
	                        	.then( (resp)=>
	                        		           {
	                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
	                        			       haltWait();
	                        			       showModal_k("Done",resp.message);
	                        			       }
	                        		 )
	                        	.catch(err=>
	                        		        {
	                        		        	haltWait();
	                        		        	document.querySelector('#warn-i').innerHTML=err;
	                        		        }
	                        		  );
	                        }
	             );