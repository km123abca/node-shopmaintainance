let bills;
let order_dict={"Bill_id":0,"Datex":0,"Cashier":0,"total":0};
function compare_vals(val1,val2,sortParam)
	{
		if(order_dict[sortParam]==0)
		{
			order_dict[sortParam]=1;
			if(val1>val2) return true;
			return false;
		}
		else
		{
			order_dict[sortParam]=0;
			if(val1<val2) return true;
			return false;
		}
	}
function showBill(x)
	{
		let elem=document.querySelector(`#bill${x}`);
		if(elem.style.display!="block")
			elem.style.display="block";
		else 
			elem.style.display="none";
	}
function loadBills()
	{
		fetch('report')
		.then(
			   resp =>{

			           return resp.json()	
			          }		       
			 )
		.then(
		     resp=>{

		     			if(resp.msg!="ok")
		     			{
		     				document.querySelector("#err_msg").innerHTML=resp.msg;
		     				return false;
		     			}
		     			bills=resp.bills;
		     			loadBillData();     			
		     				
		     		}
		     	      
			 ).catch(
			 	err=>{
			 		document.querySelector("#err_msg").innerHTML=err;
			 	}
			 );
	}

function loadBillData()
	{
		document.querySelector("#rep_tab_body").innerHTML="";
		for(var bid in bills)
	     				{
	     					bill=bills[bid];
	     					let innerstrr=`
	     					         <table class="table table-dark" id="bill${bid}" style="display:none;">
	     					           <thead>
	     					             <tr>
	     					               <th>Product</th>
	     					               <th>Quantity</th>
	     					               <th>Price</th>
	     					               <th>Total Price</th>
	     					             </tr>
	     					           </thead>
	     					           <tbody>		     					          
	     					`;
	     					var gTotal=0;
	     					var tax,allTotal;
	     					for(var product of bill.products)
	     					{
	     						let totalPrice=parseFloat(product.Product_Price)*
	     						               parseFloat(product.Qty);
	     						    gTotal+=totalPrice;
	     						    totalPrice=totalPrice.toFixed(2);
	     						    
	     						innerstrr+=`
	     						   <tr>
	     						     <td>${product.Product_Name}</td>
	     						     <td>${product.Qty}</td>
	     						     <td>${product.Product_Price}</td>
	     						     <td>${totalPrice}</td>
	     						   </tr>
	     						`;

	     					}
	     					tax=0.05*gTotal;
	     					allTotal=gTotal+tax;
	     					// allTotal=55;
	     					innerstrr+=`<tr>
	     								  <td></td>
	     								  <td></td>
	     					              <td>Subtotal:</td>
	     					              <td>${gTotal}</td>
	     					            </tr>

	     					            <tr>
	     					              <td></td>
	     					              <td></td>
	     					              <td>Tax:</td>
	     					              <td>${tax.toFixed(2)}</td>
	     					            </tr>

	     					            <tr>
	     					              <td></td>
	     					              <td></td>
	     					              <td>Total:</td>
	     					              <td>${allTotal}</td>
	     					            </tr>

	     					            </tbody>
	     					            </table>
	     					`;
	     					bills[bid]["total"]=allTotal;
	     					let strr=`
	     					          <tr>
	     					          <td><a href="javascript:showBill(${bid})" class='blink'>	     					                 
	     					              ${bill.Bill_id}</a></td>
	     					          <td>${new Date(parseInt(bill.Datex)).toLocaleDateString('en-GB')}</td>
	     					          <td>${bill.Cashier}</td>
	     					          <td>${allTotal}</td>
	     					          </tr>

	     					          <tr>
	     					          	<td colspan="4">${innerstrr}</td>
	     					          </tr>
	     					`;
	     					document.querySelector("#rep_tab_body").innerHTML+=strr;
	     				}
	}
loadBills();

function sortBills(sortParam)
	{
		
		for(var i=bills.length-1;i>0;i--)
		{
			for(var j=0;j<i;j++)
			{
				/*
				if(compare_vals(bills[j][sortParam],
					            bills[j+1][sortParam],
					            sortParam
					            )
				  )
				  */
				if(bills[j][sortParam]>bills[j+1][sortParam])
				{
					let temp=bills[j];
					bills[j]=bills[j+1];
					bills[j+1]=temp;
				}
			}
		}

		loadBillData();
	}
	 /*
	 {"msg":"ok",
	  "bills": 
	           [{"Bill_id":1000,
	             "Datex":"1593339547340",
	             "Cashier":"Anonymous",
	             "products":[{"Product_id":"4003","Qty":1,"Product_Name":"Peaches","Product_Price":12},
	                         {"Product_id":"1010","Qty":1,"Product_Name":"Grapes","Product_Price":12}
	                        ]
	            },
	            {"Bill_id":1001,
	             "Datex":"1593339547340",
	             "Cashier":"Kitchu",
	             "products":[{"Product_id":"4003","Qty":1,"Product_Name":"Peaches","Product_Price":12},
	                         {"Product_id":"1003","Qty":1,"Product_Name":"Oranges","Product_Price":34},
	                         {"Product_id":"1010","Qty":1,"Product_Name":"Grapes","Product_Price":12}]},
	            {"Bill_id":1002,
	             "Datex":"1593448090145",
	             "Cashier":"Anonymous",
	             "products":[{"Product_id":"4003","Qty":1,"Product_Name":"Peaches","Product_Price":12},
	                         {"Product_id":"1003","Qty":1,"Product_Name":"Oranges","Product_Price":34}
	                        ]
	            }
	           ]
	}*/