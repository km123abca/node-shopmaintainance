


// var products=null;
function populateProducts()
	{
		// fetch('http://localhost:3001/inventory/inv_json')
		fetch('inventory/inv_json')
		.then((resp)=>
			        {			        
			        return resp.json();
			        }
			 )
		.then((resp)=>
			        {
			        	products=resp;   
			        	for(var i in products){
			        	 var p=products[i];
			        	 p.ind=i;
			        	 p.Product_Date=new Date(parseInt(p.Product_Date)).toLocaleDateString() ;  
			        	 p.Product_Change_Date=new Date(parseInt(p.Product_Change_Date)).toLocaleDateString() ; 
				        }                 
			        	var hbars_template=`{{# each products}}
												<tr>
													<td class="pductid">{{this.Product_id}}</td>
													<td class="pductnm">{{this.Product_Name}}</td>
													<td class="pductdsc">{{this.Product_Desc}}</td>
													<td class="pductqty">{{this.Product_Qty}}</td>
													<td class="pductprc">{{this.Product_Price}}</td>
													<td>
													    {{this.Product_Date}}<br>
													    {{this.Product_Change_Date}}
													</td>
													<td>
													 <a href="javascript:loadData({{this.ind}})">
													 <img src={{this.Product_Image}} alt="no image" 
													      width="128" height="128"
													 />
													 </a>
													</td>
												</tr>
					                        {{/each}}`;
						hbars_template=Handlebars.compile(hbars_template);
						document.querySelector('#inv-table-body').innerHTML=hbars_template({products:products});			        	
			        }
			 )		
		.catch(			     
			     	err=>{console.log(err)}			     
		      )
	}



populateProducts();

function loadData(x){
	document.querySelector("#idin").value=document.getElementsByClassName("pductid")[x].innerHTML;
	document.querySelector("#namein").value=document.getElementsByClassName("pductnm")[x].innerHTML;
	document.querySelector("#descin").value=document.getElementsByClassName("pductdsc")[x].innerHTML;
	document.querySelector("#qtyin").value=document.getElementsByClassName("pductqty")[x].innerHTML;
	document.querySelector("#pricein").value=document.getElementsByClassName("pductprc")[x].innerHTML;
}



const form=document.getElementById("updateForm");
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
	                        	fetch('inventory',
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
	                        			       // document.querySelector('#warn-add').innerHTML=resp.message;
	                        			       showModal_k("Done",resp.message);
	                        			       populateProducts();
	                        			       form.reset();
	                        			       }
	                        		 )
	                        	.catch(err=>
	                        		        {
	                        		        	document.querySelector('#warn-add').innerHTML=err;
	                        		        }
	                        		  );
	                        }
	             );



