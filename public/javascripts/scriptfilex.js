let focussed_input="none";
let active_row=-1;
let totalValue=0;
let live_bill=[];



function printbill()
	{
		let paidAmt=parseFloat(document.querySelector("#pment").value);
		let toPayAmt=parseFloat(document.querySelector("#total_pane2").innerHTML);
		if(paidAmt<toPayAmt)
			{
				showModal_k("not Enought","Payment is short");
				return false;
			}
		else
			{
				document.querySelector("#paybal").innerHTML=(paidAmt-toPayAmt).toFixed(2);
			}
		//todo sent the bill data to server
		
	}
// function that updates a bill variable as new products are added
function updateLiveBill(pr_id,qty)
	{
		for(var i in live_bill)
		{
			if(live_bill[i].Product_id==pr_id)
				{live_bill[i].qty=qty;break;}
		}
		console.log(JSON.stringify(live_bill));
	}
function addNewToBill(pr_id,qty)
	{
		live_bill.push({"Product_id":pr_id,"qty":qty});
		console.log(JSON.stringify(live_bill));
	}

function deleteFromLiveBill(pr_id,qty)
	{
		var k;
		for(var i in live_bill)
		{
			if(live_bill[i].Product_id==pr_id)
				{
					live_bill[i].qty=qty;
					k=i;
					break;
				}
		}
		live_bill.splice(k,1);
		console.log(JSON.stringify(live_bill));
	}
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
	
	if(focussed_input=="qty" )
	    {
	    if(active_row==-1)
	    	{
	    	focussed_input="scanid"
	    	return false;
	    	}
	    let prevPricex=document.getElementsByClassName('salesRow')[active_row].querySelector("#ptotpr").innerHTML;
	    prevPricex=parseFloat(prevPricex);
	    totalValue-=prevPricex;    	
 		document.querySelector("#qty").value+=elem.innerHTML; 		
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#pqty").innerHTML=elem.innerHTML;
 		var pricex=document.getElementsByClassName('salesRow')[active_row].querySelector("#pprice").innerHTML;
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#ptotpr").innerHTML=
 		              parseFloat(elem.innerHTML)*parseFloat(pricex);
 		totalValue+=parseFloat(elem.innerHTML)*parseFloat(pricex);
 		updateSubtotal_2pane(totalValue);
 		updateSubtotal_3pane(totalValue);
      
        updateLiveBill(
        				document.getElementsByClassName('salesRow')[active_row].querySelector("#pr_id").value,
 						document.getElementsByClassName('salesRow')[active_row].querySelector("#pqty").innerHTML
 		              );
     	}
    else if(focussed_input=="pment")
    	{
    	if(active_row==-1)
    		{
    		focussed_input=scanid;
	    	return false;
	        }
	    document.querySelector("#pment").value+=elem.innerHTML; 
   	 	}
    else
    	{
         document.querySelector("#scanid").value+=elem.innerHTML;
         checkWithServer(document.querySelector("#scanid").value);
    	}	

	}
function clearx()
	{
		if(focussed_input=="qty" || focussed_input=="pment")
		  document.querySelector("#"+focussed_input).value="";		
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
						  	     	let stringToPush=`<tr class="salesRow">
						  	     	<input type="hidden" id="p_esc" value="${response.Product_Desc}"/>
									<input type="hidden" id="pr_id" value="${new_id}"/>
						  	     						<td id="pna_e">${response.Product_Name}</td>
														<td id="pqty">1</td>
														<td id="pprice">${response.Product_Price}</td>
														<td id="ptotpr">${response.Product_Price}</td>
						  	     					  </tr>
						  	     	 `;

						  	     	 live_bill.push(
						  	     	 				{
						  	     	 					"Product_id":new_id,
						  	     	 					"qty":1,						  	     	 					
						  	     	 				}
						  	     	 	);

						  	     	document.querySelector("#billing-tbody").innerHTML=stringToPush+
						  	     	                         document.querySelector("#billing-tbody").innerHTML;

						  	     	//update the active row and color it
						  	     	var t_rows=document.getElementsByClassName('salesRow');
						  	     	active_row=0; 						  	     						  	     	
						  	     	for(var i=0;i<t_rows.length;i++)
						  	     		t_rows[i].classList.remove("colored_row");
						  	     	t_rows[active_row].classList.add("colored_row"); 

						  	     	//update subtotal
						  	     	totalValue+=parseFloat(response.Product_Price);
						  	     	updateSubtotal_2pane(totalValue);					  	     	

						  	     	//update subtotal in pane3	
						  	     	updateSubtotal_3pane(totalValue); 	     		
						  	     	
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

	function updateSubtotal_2pane(totalValue)
		{
			document.querySelector("#subtotal_pane2").innerHTML=totalValue; 
  	     	document.querySelector("#tax_pane2").innerHTML=(totalValue*0.05).toFixed(2);
  	     	document.querySelector("#total_pane2").innerHTML=
  	     	   (
  	     	   parseFloat(document.querySelector("#subtotal_pane2").innerHTML)+
  	     	   parseFloat(document.querySelector("#tax_pane2").innerHTML)
  	     	   ).toFixed(2);
		}
	function updateSubtotal_3pane(totalValue)
		{
			document.querySelector("#subtotal_pane3").innerHTML=totalValue;
  	     	document.querySelector("#tax_pane3").innerHTML=(totalValue*0.05).toFixed(2);
  	     	document.querySelector("#total_pane3").innerHTML=
		  	     	(parseFloat(document.querySelector("#subtotal_pane3").innerHTML)+
		  	     	 parseFloat(document.querySelector("#tax_pane3").innerHTML)
		  	     	 ).toFixed(2);
		}
	function deleteARow()
		{
			let salesRows=document.getElementsByClassName("salesRow");
			if(active_row==-1) return false;
			deleteFromLiveBill(
        				document.getElementsByClassName('salesRow')[active_row].querySelector("#pr_id").value,
 						document.getElementsByClassName('salesRow')[active_row].querySelector("#pqty").innerHTML
 		              );
			let prevPricex=
				document.getElementsByClassName('salesRow')[active_row].querySelector("#ptotpr").innerHTML;
	    	prevPricex=parseFloat(prevPricex);
	    	totalValue-=prevPricex;
			salesRows[active_row].remove();
			//salesRows=document.getElementsByClassName("salesRow");
			if(salesRows.length==0)
				{
					active_row=-1;					
				} 
		    else
			active_row=(active_row-1==-1)?numSalesRows-1:active_row-1;
			//recolor active row					  	     	 						  	     						  	     	
			for(var i=0;i<salesRows.length;i++)
			   salesRows[i].classList.remove("colored_row");
			if(active_row!=-1)
			salesRows[active_row].classList.add("colored_row");

			updateSubtotal_2pane(totalValue);
			updateSubtotal_3pane(totalValue);
			mirrorActiveRow(); 



		}

	function mirrorActiveRow()
		{
			let ac_ro=document.getElementsByClassName('salesRow')[active_row];
			document.querySelector("#itemname").value=ac_ro.querySelector("#pna_e").innerHTML;
			document.querySelector("#desc").value=ac_ro.querySelector("#p_esc").value;
			document.querySelector("#price").value=ac_ro.querySelector("#pprice").innerHTML;
			document.querySelector("#qty").value=ac_ro.querySelector("#pqty").innerHTML;
		}

	document.onkeyup = function (e) {
      // console.log(e.keyCode + " pressed");
      if(!document.getElementsByClassName("salesRow"))
      	return false;
      if(document.getElementsByClassName("salesRow").length==0)
      	return false;
      let numSalesRows=document.getElementsByClassName("salesRow").length;
      if(e.keyCode==38) //uparrow
  		{
  			active_row=(active_row-1==-1)?numSalesRows-1:active_row-1;
  		}
  	  if(e.keyCode==40)//downarrow
	  	{
	  		active_row=(active_row+1==numSalesRows)?0:active_row+1;
	  	}
	  if(e.keyCode==38 || e.keyCode==40)
		{
			var t_rows=document.getElementsByClassName('salesRow');						  	     	 						  	     						  	     	
			for(var i=0;i<t_rows.length;i++)
			   t_rows[i].classList.remove("colored_row");
			t_rows[active_row].classList.add("colored_row");
			mirrorActiveRow();
		}      
    };


