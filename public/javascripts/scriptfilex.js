let focussed_input="none";
let active_row=-1;
let totalValue=0;
let live_bill=[];
let presentStock=-1;
let active_bill=1000;
let allBills={};
allBills[active_bill]=live_bill;

function addToSelectables(bill_id)
	{
		let elemx=document.querySelector("#selopt");
		if(elemx.innerHTML.indexOf(`<option>${bill_id}</option>`)==-1)
			elemx.innerHTML+=`<option>${bill_id}</option>`;
	}
function removeFromSelectables(bill_id)
	{
		let elemx=document.querySelector("#selopt");
		if(elemx.innerHTML.indexOf(`<option>${bill_id}</option>`)!=-1)
			elemx.innerHTML=elemx.innerHTML.replace(`<option>${bill_id}</option>`,'');
	}

function addAllLegacyBills()
	{
		for(var x in allBills)
		{
			addToSelectables(x);
		}

	}

function get_stuff_from_parent_url(pivot_word='=',pos=0)
					{
						var pv=pivot_word,extracted_variable;
						var extracted_variable=-1
			   	 		if(parent.document.URL.indexOf('=')!=-1)
						    {
						    	var symb_pos=parseInt(parent.document.URL.indexOf(pv,pos));
						    	var num_chars= parent.document.URL.length-symb_pos;			    	
						    	
								extracted_variable=(parent.document.URL.substr(symb_pos+1, num_chars));	
						    }
						if(extracted_variable==-1)
							return '';
						return extracted_variable;
			    	}

function showPop(bid)
	{
		let pment,paybal;
		let cashier=document.querySelector("#cashier").value
		pment=document.querySelector("#pment").value;
		paybal=document.querySelector("#paybal").innerHTML;
		let dataPrep={ 
			           "bill_id":bid,
			           "live_bill":live_bill,
			           "cashier":cashier,
			           "pment":pment,
			           "paybal":paybal,
			         };
	    dataPrep=JSON.stringify(dataPrep);
	    console.log(dataPrep);
		window.open(`/html/pop.html?data=${dataPrep}`,'popup_win','menubar=no,scrollbars=no, width=400,height=600');
	}
function showWait()
	{
		document.querySelector("#loading").style.display="block";
	}
function haltWait()
	{
		document.querySelector("#loading").style.display="none";
	}

function clearHTML()
	{
		val_list=['itemname','desc','price','qty','scanid','pment'];
		innerHTML_list=['subtotal_pane2','tax_pane2','total_pane2',//'paid_pane2',
		                'subtotal_pane3','tax_pane3','total_pane3','paid_pane3',
		                'paybal'];
		for(var a of innerHTML_list)		
			document.querySelector("#"+a).innerHTML="";
		for(var b of val_list)
			document.querySelector("#"+b).value="";	
		// console.log('clearing sales row');
		$('.salesRow').remove();
	}
function clearAll()
	{		
		delete allBills[active_bill];
		removeFromSelectables(active_bill);
		storeLocally();

		live_bill=[];
		totalValue=0;
		active_row=-1;
		getLatestBill();
		val_list=['itemname','desc','price','qty','scanid','pment'];
		innerHTML_list=['subtotal_pane2','tax_pane2','total_pane2','paybal','bal_pane3'];
		for(var a of innerHTML_list)		
			document.querySelector("#"+a).innerHTML="";
		for(var b of val_list)
			document.querySelector("#"+b).value="";	

		// var srows=document.getElementsByClassName("salesRow");
		// for(var i=0;i<srows.length;i++)
		//     elem.remove(0);	
		$('.salesRow').remove();
	}
function computeBalance()
	{

		if(document.querySelector("#pment").value=="")
		{
		  showModal_k("Error","Enter the Paid Amount");
		  return false;	
		}
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
				document.querySelector('#bal_pane3').innerHTML=(paidAmt-toPayAmt).toFixed(2);
				document.querySelector('#paid_pane3').innerHTML=paidAmt;
			}
	}
function getLatestBill()
	{   
		setLocalData();
		// console.log(live_bill);
		let elem=document.querySelector('#rcptnum');
		elem.innerHTML=1000;
		// return bill_id;
		fetch('/sales/latestbill')
		     .then(response=>response.json())
		     .then(
		     	    response=>
		     	           {
		     	           	if(response.msg=="success")
		     	           			{		     	           		
		     	           			elem.innerHTML=response.bill_id;
		     	           			active_bill=response.bill_id;
		     	           			if(!allBills[active_bill])
		     	           				allBills[active_bill]=live_bill;
		     	           			getBill(active_bill);
		     	           			addToSelectables(active_bill);
		     	           			}
		     	           	else 
		     	           		{
		     	           			showModal_k("error","Error at Backend");		     	           			
		     	           		}
		     	           }
		     	  )
		     .catch(
		     		err=>{
		     			   showModal_k("Error","Front end error while fetching latest bill no");
		     			 }
		     	   );
		 
	}
function displayLatestBill()
	{		
		document.querySelector('#rcptnum').innerHTML=getLatestBill();		
	}
function printbill()	
	{
		if(active_row==-1)
		{
			showModal_k("Error","You have to Make a Bill First");
			return false;
		}
		if(document.querySelector("#paybal").innerHTML=="")
		{
		  showModal_k("Error","Enter the Paid Amount");
		  return false;	
		}
        /*
		if(document.querySelector("#pment").value=="")
		{
		  showModal_k("Error","Enter the Paid Amount");
		  return false;	
		}
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
        */
		//todo sent the bill data to server
		let cashier=document.querySelector("#cashier").value;
		if(cashier=="") 
			cashier="Anonymous";
		fetch('/sales/logbill',
			                 {
			                 	method:'POST',
			                 	body:JSON.stringify({bill:live_bill,cashier:cashier}),
			                 	headers:{
			                 			  "content-type":"application/json",
			                 	        }
			                 }
			 )		     
		     .then(
			         (response)=>
						          {						          	
						          	return response.json();
						          }
			       )
		     .then(
		     		(response)=>
		     					{
		     						showModal_k("New Bill",response.bill_id+" generated");
		     						showPop(response.bill_id);
		     						clearAll();
		     					}
		     	  )
		     .catch(
		     	  	(err)=>{
		     	  		showModal_k("error",err);
		     	  	}
		     	  );

	}

//functions to store and retrieve from local storage
function destroyLocalStorage()
	{
		if(confirm('This will clear all bills are you sure?'))
		localStorage.clear();
	}
function storeLocally()
	{
		console.log('backed up locally');
		localStorage.setItem('allBills',JSON.stringify(allBills));
	}
function getLocalData()
	{
		let docs=localStorage.getItem('allBills');
		docs=JSON.parse(docs);
		if(docs)
		{
			console.log('doc found');
			return docs;
		}
		else{
			console.log('no earlier record');
			return {};
		}
	}

function setLocalData()
	{
		allBills=getLocalData();
		addAllLegacyBills();
		// console.log(JSON.stringify(allBills));
	}
//Functions to Extract and store specific bill id's
function selChanged()
	{
		// showModal_k('info',document.querySelector('#selopt').value);
		if(document.querySelector('#selopt').value!='--')
			getBill(document.querySelector('#selopt').value);
	}
function getBill(bill_id="")
	{
		console.log('get bill:'+bill_id);
		if(bill_id=="")
			{
			  let largest=1000;
			  for(var key in allBills)
			  {
			  	if(key>largest)
			  		largest=key;
			  }
			  
			  active_bill=parseInt(largest)+1;
			  
			  addToSelectables(active_bill);
			  live_bill=[];
			  allBills[active_bill]=live_bill;
			  active_row=-1;
			  clearHTML();
			  document.querySelector('#rcptnum').innerHTML=active_bill;

			}
		else if(allBills[bill_id])
			{
				// console.log('yes ');
				clearHTML();
				active_bill=bill_id;
				live_bill=allBills[bill_id];

				active_row=-1;
				if(live_bill.length>0) active_row=0;
				document.querySelector('#rcptnum').innerHTML=active_bill;	
				let granTot=0;	
				let tempStorage=document.querySelector('#billing-tbody').innerHTML;		
				document.querySelector('#billing-tbody').innerHTML='';
				for(var elem of live_bill)
				{
					let p_price=parseFloat(elem.qty*parseFloat(elem.Product_Price));
					granTot+=p_price;
					p_price=p_price.toFixed(2);
					
					
					
					document.querySelector('#billing-tbody').innerHTML+=
						`
						<tr class="salesRow">
						  	     	<input type="hidden" id="p_esc" value="${elem.Product_Desc}"/>
									<input type="hidden" id="pr_id" value="${elem.Product_id}"/>
									<input type="hidden" id="pr_stk" value="${elem.Product_Qty}"/>
						  	     						<td id="pna_e">${elem.Product_Name}</td>
														<td id="pqty">${elem.qty}</td>
														<td id="pprice">${elem.Product_Price}</td>
														<td id="ptotpr">${p_price}</td>
						</tr>						
						`;					
				}
				document.querySelector('#billing-tbody').innerHTML+=tempStorage;
				if(live_bill.length!=0) active_row=0;
				console.log('granTot:'+granTot);
				updateSubtotal_3pane(granTot);
				updateSubtotal_2pane(granTot);
				totalValue=granTot;
			}
	}


//##################################################
//functions to handle cookies
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//###########################

// function that updates a bill variable as new products are added
function updateLiveBill(pr_id,qty)
	{
		for(var i in live_bill)
		{
			if(live_bill[i].Product_id==pr_id)
				{live_bill[i].qty=qty;break;}
		}
		storeLocally();
		console.log(JSON.stringify(live_bill));
		console.log(getCookie('allBills'));

	}
function addNewToBill(pr_id,qty)
	{
		live_bill.push({"Product_id":pr_id,"qty":qty});
		storeLocally();
		console.log(JSON.stringify(live_bill));
		console.log(JSON.stringify(allBills));
		// setCookie('allBills',JSON.stringify(allBills),1);
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
		storeLocally();
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

	    //allow qty increase only in case stock is available
	    let pres_stock=document.getElementsByClassName('salesRow')[active_row].querySelector("#pr_stk").value;
	    if(parseInt(document.querySelector("#qty").value+elem.innerHTML)>parseInt(pres_stock))
	    	{
	    		showModal_k(`error`,`Inventory short, only ${pres_stock} available`);
	    		return false;
	    	}

	    prevPricex=parseFloat(prevPricex);
	    totalValue-=prevPricex;

 		document.querySelector("#qty").value+=elem.innerHTML; 		
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#pqty").innerHTML=
 		document.querySelector("#qty").value;
 		var pricex=document.getElementsByClassName('salesRow')[active_row].querySelector("#pprice").innerHTML;
 		document.getElementsByClassName('salesRow')[active_row].querySelector("#ptotpr").innerHTML=
 		                parseFloat(document.querySelector("#qty").value)*parseFloat(pricex);
 		             // parseFloat(elem.innerHTML)*parseFloat(pricex);
 		totalValue+=parseFloat(document.querySelector("#qty").value)*parseFloat(pricex);
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
		showWait();
		fetch('/sales/withid',
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
 								haltWait();
						  	     if ((response.message=="found")&&(response.Product_Qty>0))
						  	     	{
						  	     	
						  	     	document.querySelector("#itemname").value =response.Product_Name;
						  	     	document.querySelector("#desc").value     =response.Product_Desc;
						  	     	document.querySelector("#qty").value      =1;
						  	     	document.querySelector("#price").value    =response.Product_Price;
						  	     	let stringToPush=`<tr class="salesRow">
						  	     	<input type="hidden" id="p_esc" value="${response.Product_Desc}"/>
									<input type="hidden" id="pr_id" value="${new_id}"/>
									<input type="hidden" id="pr_stk" value="${response.Product_Qty}"/>
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
						  	     	 					"Product_Name":response.Product_Name,
						  	     	 					"Product_Price":response.Product_Price,	
						  	     	 					"Product_Desc":response.Product_Desc,
						  	     	 					"Product_Qty":response.Product_Qty,						  	     	 										  	     	 					
						  	     	 				}
						  	     	 	);
						  	     	 storeLocally();

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
						  	     		if(response.message!="found")
						  	     		 showModal_k("Error","No Such item");
						  	     		else
						  	     			showModal_k("Error",response.Product_Name+" are out of stock");
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
			if(active_row==-1)
				{		
			document.querySelector("#itemname").value="";
			document.querySelector("#desc").value="";
			document.querySelector("#price").value="";
			document.querySelector("#qty").value="";
			    }
			else{
			let ac_ro=document.getElementsByClassName('salesRow')[active_row];
			document.querySelector("#itemname").value=ac_ro.querySelector("#pna_e").innerHTML;
			document.querySelector("#desc").value=ac_ro.querySelector("#p_esc").value;
			document.querySelector("#price").value=ac_ro.querySelector("#pprice").innerHTML;
			document.querySelector("#qty").value=ac_ro.querySelector("#pqty").innerHTML;
				}
		}

	document.onkeyup = function (e) {


	//Testing code to be deleted on Production
     if(e.keyCode==37)
     {
     	console.log('showing wait');
     	showWait();
     }
     else if(e.keyCode==39)
     {
     	console.log('halting wait');
     	haltWait();
     }

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

    


