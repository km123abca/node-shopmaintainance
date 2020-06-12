// const form=document.getElementById("inventory-form");
// //const form = document.querySelector("form");
// form
// .addEventListener("submit", 
// 	                      (event) => 
// 	                        {
// 	                        	event.preventDefault();
// 	                        	const formData = new FormData(form);
// 	                        	const Product_id=formData.get("Product_id");
// 	                        	const Product_Name=formData.get("Product_Name");
// 	                        	const Product_Desc=formData.get("Product_Desc");
// 	                        	const Product_Qty=formData.get("Product_Qty");
// 	                        	const Product_Price=formData.get("Product_Price");
// 	                        	const Product_Image=formData.get("Product_Image");
// 	                        	console.log(`${Product_Name} will be stored`);
// 	                        	fetch('http://localhost:3001/inventory',
// 	                        		               {
// 	                        		               	method:"POST",
// 	                        		               	body:formData,
// 	                        		               	headers: {
// 	                        		               			   "content-type":"multipart/form-data",
// 	                        		               			 },
// 	                        		               }	                        		               
// 	                        		 )
// 	                        	.then(response=>response.json())
// 	                        	.then( (resp)=>
// 	                        		           {
// 	                        			       document.querySelector('#warn-i').innerHTML=resp.message;
// 	                        			       }
// 	                        		 )
// 	                        	.catch(err=>
// 	                        		        {
// 	                        		        	document.querySelector('#warn-i').innerHTML=err;
// 	                        		        }
// 	                        		  );
// 	                        }
// 	             );


function showModal_k(titlemessage="no title",bodymessage="Dang it Kitchu.. Pull yourself together ")
{
 $('#mheader').html(titlemessage);
 $('#mmessage').html(bodymessage);
 $('#mm').modal();
}


