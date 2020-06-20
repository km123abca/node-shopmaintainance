const productsx=require('../../models/productsx');
const mongoose=require('mongoose');
const w2file=require('../../filesaver');

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