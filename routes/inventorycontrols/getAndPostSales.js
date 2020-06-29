const productsx=require('../../models/productsx');
const salesx=require('../../models/sales');
const billsx=require('../../models/bills');
const mongoose=require('mongoose');
const w2file=require('../../filesaver');

const salesReport_graphic=(req,res)=>{
                                      res.render('Sales/salesReport',{title:'sales report'});
};

const salesReport=(req,res)=>{
								billsx.find()
								      .exec()
								      .then(
								      	async docs=>
								      		   {
								      		   	 let bills=[];
								      		   	 for(var doc of docs)
								      		   	    {
								      		   	  	let bill={
								      		   	  				"Bill_id":doc.Bill_id,
								      		   	  				"Datex"  :doc.Datex,
								      		   	  				"Cashier":doc.Cashier,
								      		   	  				"products":[],
								      		   	  	         };
								      		        await salesx.find({"Bill_id":doc.Bill_id})
								      		   	  	      .exec()
								      		   	  	      .then(
								      		   	  	      		  async entries=>
								      		   	  	      		 	{								      		   	  	      		 		
								      		   	  	      		 		for(var entry of entries)
								      		   	  	      		 		{

								      		   	  	      		 	    await productsx.findOne({"Product_id":entry.Product_id})
								      		   	  	      		 	          .exec()
								      		   	  	      		 	          .then(
								      		   	  	      		 	          	    producty=>
								      		   	  	      		 	          	         {
									      		   	  	      		 	          	      bill.products.push(
									      		   	  	      		 						{
									      		   	  	      		 						  "Product_id":entry.Product_id,
									      		   	  	      		 						  "Qty":entry.Qty,
									      		   	  	      		 						  "Product_Name":producty.Product_Name,	
									      		   	  	      		 						  "Product_Price":producty.Product_Price,
									      		   	  	      		 						}
									      		   	  	      		 				       );
								      		   	  	      		 	          	         }
								      		   	  	      		 	          	   )
								      		   	  	      		 	          .catch(
								      		   	  	      		 	          	     err=>
								      		   	  	      		 	          	          {
								      		   	  	      		 	          	          	res.status(500).json(
																  	   											{
																  	   												msg:"error while matching id with product",
																  	   												error:err,
																  	   											}
						  	   															                        );
								      		   	  	      		 	          	          }
								      		   	  	      		 	          	   );
								      		   	  	      		 	 
								      		   	  	      		 		}
								      		   	  	      		 	}
								      		   	  	      	    )
								      		   	  	      .catch(err=>	
	  	   				                       						{						  	   										
						  	   										 res.status(500).json(
											  	   											{
											  	   												msg:"error during product search",
											  	   												error:err,
											  	   											}
						  	   															  );
	  	   				                       						}
										    					);
								      		   	  	      bills.push(bill);
								      		   	    }
								      		   	   res.status(200).json(
								      		   	   						{
								      		   	   	                    msg:"ok",
								      		   	   	                    bills:bills,
								      		   	   	                    }
								      		   	                      ); 
								      		    }
								      	   )
								      .catch(err=>	
	  	   				                       {
						  	   					console.log(err);
						  	   					res.status(500).json(
						  	   											{
						  	   												msg:"error while traversing bills",
						  	   												error:err,
						  	   											}
						  	   										);
	  	   				                       }
										    );
							 };

const updateBill= (req,res)=>{
								var listOfItems=req.body.bill;
								var cashier=req.body.cashier;
								let bill_id_new;
								billsx.findOne()
								      .sort('-Bill_id')
								      .exec()
								      .then(
								      		doc=>{
								      			    if(!doc)
								      			    {
								      			    	bill_id_new=1000;
								      			    }
								      			    else
								      			    {
								      			    	bill_id_new=doc.Bill_id+1;
								      			    }
								      			    let n_bill=new billsx(
								      			    					  {
								      			    					  	Bill_id:bill_id_new,
								      			    					  	Cashier:cashier,
								      			    					  }
								      			    					 );
								      			    n_bill.save();
								      			    for(var item of listOfItems)
								      			    {
								      			    	let n_item=new salesx(
								      			    							{
								      			    								Bill_id:bill_id_new,
								      			    								Product_id:item.Product_id,
								      			    								Qty:item.qty,
								      			    							}
								      			    		                 ); 

								      			    	n_item.save()
								      			    	      .then(
								      			    	      	    result=>
								      			    	      	     {
								      			    	      	     	productsx.findOne({Product_id:item.Product_id})
								      			    	         				 .exec()
								      			    	         				 .then(
								      			    	         	    			    doc=>{
								      			    	         	    			    		if(doc)
								      			    	         	    			    			{
								      			    	         	    			    				w2file(JSON.stringify(doc));
								      			    	         	    			    				doc.Product_Qty-=item.qty;
								      			    	         	    			    				doc.save();
								      			    	         	    			    				w2file(JSON.stringify(doc));
								      			    	         	    			    			}
								      			    	         	    			    		else
								      			    	         	    			    			{
								      			    	         	    			    				throw {
								      			    	         	    			    					    error:"out of stock error",
								      			    	         	    			    					    msg:"out of stock error",
								      			    	         	    			    				      };
								      			    	         	    			    			}
								      			    	         	    			         }
								      			    	         	  				  )
								      			    	         				 .catch(err=>
								      			    	         							{
								      			    	         							res.status(500).json(
								      			    	         													{
													      			    	         						         error:err,
													      			    	         							     msg:"error while attempting to update inventory",
								      			    	         					        				    	}
								      			    	         					        				    );
								      			    	         							}
								      			    	         	  				    );
																		
								      			    	      	     }
								      			    	      	   )
								      			    	      .catch(err=>	
							  	   				                       {  											  	   					
  											  	   					res.status(500).json(
  											  	   											{
  											  	   												error:err,
  											  	   												msg:"Backend error while saving an item to bill",
  											  	   											}
  											  	   										);
							  	   				                       }
												  	   	            );
								      			    }
								      			    res.status(200).json(
								      			    		{
								      			    		  "bill_id":bill_id_new,
								      			    		  "msg":"success",
								      			    		}
								      			    	);
								      			  }
								      	   )
								      .catch(err=>	
	  	   				                       {
						  	   					console.log(err);
						  	   					res.status(500).json(
						  	   											{
						  	   												msg:"error while searching for bill",
						  	   												error:err,
						  	   											}
						  	   										);
	  	   				                       }
										    );

							 };
const getSalesPage=(req,res)=>{
								res.render('Sales/salesfront');
						      };
const getDetailsWithID=(req,res)=>{
									var Product_id=req.body.Product_id;
									//w2file("in here"+Product_id);
									productsx.find({Product_id:Product_id})
									         .exec()
									         .then(
									         		docs=>
									         		      {
									         		      	if(docs.length==0)
									         		      	{  //w2file("Product does not exist in that id");
									         		      		res.status(203)
									         		      		   .json(
									         		      		   		  {
									         		      		   		  	message:"noproduct",									         		      		   		  	                                                                  
									         		      		   		  }
									         		      			    );
									         		      	}
									         		      	else
									         		      	{   //w2file("a product does exist");
									         		      		res.status(200)
									         		      		   .json(
									         		      		   	      {
									         		      		   	      	message:"found",
									         		      		   	      	Product_Name:docs[0].Product_Name,
                                        	  	 		                    Product_Desc:docs[0].Product_Desc,
                                        	  	 		                    Product_Qty :docs[0].Product_Qty,                                        	  	 		                  
                                                                            Product_Price:docs[0].Product_Price,  
									         		      		   	      }
									         		      		   	    );
									         		      	}
									         		      }
									         	  )
									         .catch(err=>	
				  	   				                       {
									  	   					console.log(err);
									  	   					res.status(500).json(
									  	   											{
									  	   												message:"error",
									  	   												error:err,
									  	   											}
									  	   										);
				  	   				                       }
												  	);
                                  };
module.exports={
				 getSalesPage,
				 getDetailsWithID,
				 updateBill,
				 salesReport,
				 salesReport_graphic,
			   };