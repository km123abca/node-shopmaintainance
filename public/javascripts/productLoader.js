// var products=null;
function populateProducts()
	{
		fetch('http://localhost:3001/inventory/inv_json')
		.then((resp)=>
			        {			        
			        return resp.json();
			        }
			 )
		.then((resp)=>
			        {
			        	products=resp;   
			        	for(p of products)
			        	 p.Product_Date=new Date(p.Product_Date).toLocaleDateString() ;                    
			        	var hbars_template=`{{# each products}}
												<tr>
													<td>{{this.Product_id}}</td>
													<td>{{this.Product_Name}}</td>
													<td>{{this.Product_Desc}}</td>
													<td>{{this.Product_Qty}}</td>
													<td>{{this.Product_Price}}</td>
													<td>{{this.Product_Date}}</td>
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

