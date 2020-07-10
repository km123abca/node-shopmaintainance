

const productsx=require('../../models/productsx');
const mongoose=require('mongoose');
const w2file=require('../../filesaver');




const getAllStuff=(req,res)=>
                             {

	                      	  // res.status(200).json({message:"you are in the inventory page"});	
	                      	  productsx.find()
	                      	          .exec() //may be we can later use where() or limit() here
	                      	          .then(
	                      	          		docs=>
	                      	          		{
                                          var hasDocs=false;
                                          if(docs.length!=0)
                                            hasDocs=true;
	                      	          		  res.render('Inventory/FullInventory',{docs:docs,hasDocs:hasDocs,});
	                      	          		}
	                      	          	   )
	                      	          .catch(error=>{next(error);})

                             };
const getAllStuff_json=(req,res)=>
                             {

                            // res.status(200).json({message:"you are in the inventory page"}); 
                            productsx.find()
                                    .exec() //may be we can later use where() or limit() here
                                    .then(
                                            docs=>
                                                  {
                                                    res.status(201).json(docs);
                                                  }
                                         )
                                    .catch(error=>{next(error);})

                             };
const addNew=(req,res)=>
                             {
                              w2file("inside add new");
                              // res.status(200).json({message:"you are in the inventory page"});   
                              productsx.find()
                                      .exec() //may be we can later use where() or limit() here
                                      .then(
                                            docs=>
                                            {
                                              res.render('Inventory/addinventory');
                                            }
                                           )
                                      .catch(error=>{next(error);})

                             };
const createNew=(req,res)=>
							{
                                // w2file("here at the route");
                                if(!req.session.loggedin || req.session.loggedin.privilege!=1)
                                  return res.status(500).json(
                                                        {
                                                          message:"privilege_error",
                                                        }
                                                      );
								                var Product_id  =req.body.Product_id;
                                var Product_Name=req.body.Product_Name;
                                var Product_Desc=req.body.Product_Desc;
                                var Product_Qty=req.body.Product_Qty;
                                var Product_Price=req.body.Product_Price;
                                try{
                                    var Product_Image=req.file.path;
                                   }
                                catch(error)
                                   {
                                    var Product_Image="uploads\\noimage.jpg";
                                   } 
                                var Product_Change_Date=Date.now();
                                // var Product_Image="uploads/6_6_2020Apples.png";
                                productsx.find({Product_id:Product_id})
                                        .exec()
                                        .then(
                                        	  docs=>
                                        	  {
                                        	  	if(docs.length==0)
                                        	  	 {
                                        	  	 	var p=new productsx(
                                        	  	 		                {
                                        	  	 		                  Product_id:Product_id,
                                        	  	 		                  Product_Name:Product_Name,
                                        	  	 		                  Product_Desc:Product_Desc,
                                        	  	 		                  Product_Qty :Product_Qty,
                                        	  	 		                  Product_Image:Product_Image,
                                                                    Product_Price:Product_Price,
                                                                    Product_Change_Date:Product_Change_Date,
                                        	  	 		                }
                                        	  	 		              );
                                        	  	 	p.save()
                                        	  	 	.then(result=>{res.status(201).json(
                                        	  	 		                  {
                                        	  	 		                  	message:"Product added successfully"
                                        	  	 		                  }
                                        	  	 		                );
                                        	  	 	              }
                                        	  	 	      )
                                        	  	 	.catch(err=>	
											  	   				                       {
                  											  	   					console.log(err);
                  											  	   					res.status(500).json(
                  											  	   											{
                  											  	   												error:err,
                  											  	   											}
                  											  	   										);
											  	   				                       }
												  	   	                       );
                                        	  	 }
                                        	  	 else
                                        	  	 {

                                        	  	 	if(Product_Name!="") docs[0].Product_Name=Product_Name;
                                        	  	 	if(Product_Desc!="") docs[0].Product_Desc=Product_Desc;
                                        	  	 	if(Product_Qty!="")  docs[0].Product_Qty=Product_Qty;
                                        	  	  if(Product_Image!="uploads\\noimage.jpg") docs[0].Product_Image=Product_Image;
                                        	  	 	docs[0].save()
		                                        	  	 	.then(result=>{res.status(201).json(
						                                        	  	 		                  {
						                                        	  	 		                  	message:"Product updated successfully"
						                                        	  	 		                  }
		                                        	  	 		                                );
		                                        	  	 	              }
		                                        	  	 	      )
		                                        	  	 	.catch(err=>	
                        													  	   				{
                        													  	   					console.log(err);
                        													  	   					res.status(500).json(
                        													  	   											{
                        													  	   												error:err
                        													  	   											}
                        													  	   										);
                        													  	   				}
												  	   	          );
                                        	  	 }

                                        	  }
                                        	 )
                                        	 .catch(error=>{next(error);})                     

							}

const welcome=(req,res)=>
                             {                             	
	                      	  // res.render('welcome',{title:"Welcome Page"}); 
                              res.status(203).json({message:"hi"});                     
                             };
module.exports={
                 getAllStuff,
                 welcome,
                 createNew,
                 addNew,
                 getAllStuff_json,
               };