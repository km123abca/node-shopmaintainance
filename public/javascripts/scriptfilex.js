let focussed_input="none";
let active_row=-1;
let totalValue=0;
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
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#pqty").innerHTML=elem.innerHTML;
 		var pricex=document.getElementsByClassName('salesRow')[active_row].querySelector("#pprice").innerHTML;
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#ptotpr").innerHTML=
 		              parseFloat(elem.innerHTML)*parseFloat(pricex);
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
						  	     	let stringToPush=`<tr class="salesRow">
						  	     						<td>${response.Product_Name}</td>
														<td id="pqty">1</td>
														<td id="pprice">${response.Product_Price}</td>
														<td id="ptotpr">${response.Product_Price}</td>
						  	     					  </tr>
						  	     	 `;

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
						  	     	document.querySelector("#subtotal_pane2").innerHTML=totalValue; 
						  	     	document.querySelector("#tax_pane2").innerHTML=(totalValue*0.05).toFixed(2);
						  	     	document.querySelector("#total_pane2").innerHTML=
						  	     	   (
						  	     	   parseFloat(document.querySelector("#subtotal_pane2").innerHTML)+
						  	     	   parseFloat(document.querySelector("#tax_pane2").innerHTML)
						  	     	   ).toFixed(2);

						  	     	//update subtotal in pane3						  	     	  
						  	     	document.querySelector("#subtotal_pane3").innerHTML=totalValue;
						  	     	document.querySelector("#tax_pane3").innerHTML=(totalValue*0.05).toFixed(2);
						  	     	document.querySelector("#total_pane3").innerHTML=
								  	     	(parseFloat(document.querySelector("#subtotal_pane3").innerHTML)+
								  	     	 parseFloat(document.querySelector("#tax_pane3").innerHTML)
								  	     	 ).toFixed(2);

						  	     		
						  	     	
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


