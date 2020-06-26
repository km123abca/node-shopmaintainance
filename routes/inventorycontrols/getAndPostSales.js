const productsx=require('../../models/productsx');
const salesx=require('../../models/sales');
const billsx=require('../../models/bills');
const mongoose=require('mongoose');
const w2file=require('../../filesaver');


const updateBill= (req,res)=>{
								var listOfItems=req.body.bill;
								let bill_id_new;
								billsx.findOne()
								      .sort('-Bill_id')
								      .exec()
								      .then(
								      		docs=>{
								      			    if(docs.length==0)
								      			    {
								      			    	bill_id_new=1000;
								      			    }
								      			  }
								      	   )
								      .catch(err=>	
	  	   				                       {
						  	   					console.log(err);
						  	   					res.status(500).json(
						  	   											{
						  	   												message:"error while searching",
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
			   };