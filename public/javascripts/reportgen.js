function loadBills()
	{
		fetch('sales/report')
		.then(
			   resp => resp.json()			       
			 )
		.then(
		     resp=>{
		     			if(resp.msg!="ok")
		     			{
		     				document.querySelector("#err_msg").innerHTML=resp.msg;
		     				return false;
		     			}
		     			for(var bill of resp.bills)
	     				{
	     					let innerstrr=`
	     					         <table>
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
	     						    totalPrice=totalPrice.toFixed(2);
	     						    gTotal+=totalPrice;
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
	     					innerstrr+=`
	     					            </tbody>
	     					            </table>
	     					`;
	     					let strr=`
	     					          <tr>
	     					          <td>${bill.Bill_id}</td>
	     					          <td>${new Date(bill.Datex).toLocaleDateString('en-GB')}</td>
	     					          <td>${bill.cashier}</td>
	     					          <td>${allTotal}</td>
	     					          </tr>

	     					          <tr>
	     					          	<td colspan="4">${innerstrr}</td>
	     					          </tr>
	     					`;
	     					document.querySelector("#rep_tab_body").innerHTML+=strr;
	     				}
		     				
		     		}
		     	      
			 )
	}
loadBills();

   /*
	{"msg":"ok",
	 "bills": 
	         [{"Bill_id":1000,
	            "Datex":"1593339547340",
	            "Cashier":"Anonymous",
	            "products":[{"Product_id":"4003","Qty":1,"Product_Name":"Peaches"},
	                        {"Product_id":"1010","Qty":1,"Product_Name":"Peaches"}]},

	           {"Bill_id":1001,
	            "Datex":"1593339547340",
	            "Cashier":"Kitchu",
	            "products":[{"Product_id":"4003","Qty":1},{"Product_id":"1003","Qty":1},{"Product_id":"1010","Qty":1}]
	            }
	           ]
	 }*/