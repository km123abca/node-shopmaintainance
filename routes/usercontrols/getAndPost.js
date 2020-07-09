const mongoose=require('mongoose');
const w2file=require('../../filesaver');
var user = require('../../models/user');
var regtoken = require('../../models/regtoken');
var sanitizer = require('sanitize')();
const { body, validationResult } = require('express-validator');

const register=(req,res)=>{
							res.render('UserMgmt/Register',{title:"Register"});
						  };
const login=(req,res)=>{
	                    let msg="",has_message=false;
						if(req.session.messages && req.session.messages.length>0)
							{
								msg=req.session.messages[0];
								has_message=true;
							}
							req.session.messages=[];
						res.render('UserMgmt/Login',{title:"Login",msg:msg,has_message:has_message});
					   };
const reg_user=async (req,res)=>{
							var username=req.body.username;
							var email=req.body.email;
							var password=req.body.password;
							var shopid=req.body.shid;
							await regtoken.findOne({Tokenstring:shopid})
							        .exec()
							        .then(
							        		doc=>{
							        				if(doc)
							        				{
							        					doc.Consumer=username;
							        					doc.save();
							        				}
							        				else
							        				{
							        					res.status(500).json(
							        										  {
							        										  	msg:"token_invalid",							        										  	
							        										  }
							        						                );
							        				}
							        			 }
							        	 )
							        .catch(
							        		err=>
							        		     {
							        		     	res.status(500).json(
							        		     						  {
							        		     						  	msg:"error",
							        		     						  	msg2:err,
							        		     						  }
							        		     		                );
							        		     }
							        	  );

							var privilege=0;
							if (shopid!=-1)
								privilege=1;
							user.findOne({$or:[{username:username},
								               {email:email}
								              ]
								         }
								        )
							    .exec()
							    .then(
							    		doc=>{
							    			  if(!doc)
							    			    {	
							    			    	
 													let new_user=new user(
			 													             {
			 																   username:username,
			 																   email:email,
			 																   password:password,
			 																   privilege:privilege,
			 													             }
 													                      );
 													new_user.save()
 													        .then(
 													        	   restl=>{
 													        	   			req.session.messages=[{"msg":"User Successfully Registered, You can login now","type":"info"}];		
 														           			res.status(201).json(
 														           				                 {
 														           				                 	msg:"ok",
 														           				                 	msg2:"user created"
 														           				                 }
 														           				                );
 														                  }
 													        	)
 													        .catch(err=>
 													        		{
 													        			res.status(500).json(
 													        								  {
 													        								  	msg:"error",
 													        								  	msg2:err,
 													        								  }
 													        				                );
 													        		}
 													        	);
							    			    }
							    			    else
							    			    {
							    			    	res.status(500).json(
							    			    						  {
							    			    						  	msg:"error",
							    			    						  	msg2:"A user with this username exists already"
							    			    						  }
							    			    		                );
							    			    }
							    		     }
							    	 )
							    .catch(
							    	   err=>{
 												res.status(500).json(

 																	{
 													                 msg:"error while validating username",
 													                 msg2:err,
 													             }
 													                );
							    	        }
							    	  );
						  };
const login_user=(req,res)=>{
							  const errors = validationResult(req);
							  // w2file(JSON.stringify(errors));
							   if (!errors.isEmpty()) 
							    {
    								res.status(422).json(
			      		  	 		                      {
			      		  	 		                       msg:"validation error",
			      		  	 			                   msg2:"validation error",
			      		  	 		                       }
							      		  	 		     );
  								}

							  let username=req.body.email;
							  let password=req.body.password;
							  // username=sanitizer.value(username,'string');
							  // password=sanitizer.value(password,'string');
							  user.findOne(
							  	           {$or:[{username:username,password:password},
							                     {email:username,password:password}
							  	                ]
							  	           }
							  	          )
							      .exec()
							      .then(
							      		doc=>
							      		  	 {
							      		  	 	if(doc)
							      		  	 	{

							      		  	 		req.session.loggedin={username:doc.username,							      		  	 			                  
							      		  	 			                  email   :doc.email,
							      		  	 			                  privilege:doc.privilege,
							      		  	 		                     };
							      		  	 		res.status(200).json(
							      		  	 		                      {
							      		  	 		                       msg:"ok",
							      		  	 			                   msg2:"login success",
							      		  	 		                      }
							      		  	 		                    );
							      		  	 	}
							      		  	 	else
							      		  	 	{
							      		  	 		res.status(500).json(
							      		  	 		                      {
							      		  	 			                   msg:"login failed",
							      		  	 			                   msg2:"username,password combination non existent",
							      		  	 		                      }
							      		  	 		                    );
							      		  	 	}
							      		  	 }
							      	   )
							      .catch(
							      		  err=>{
							      		  		 res.status(500).json(
							      		  	 		                      {
							      		  	 			                   msg:"error in process",
							      		  	 			                   msg2:err,
							      		  	 		                      }
							      		  	 		                    );
							      		       }
							      	    );

							};
const logout=(req,res)=>{
						  req.session.loggedin=false;
						  res.redirect('/user/login');
					    };
const welcome=(req,res)=>{
							res.render('welcome',{title:"Welcome"});
						 };
const infopage=(req,res)=>{
							res.render('infoPage',{
											       title:"information",
											       img:"edd.jpg",
											       info:"Random info",
						                          }
						              )
                          };
const genToken=(req,res)=>{
							res.render('UserMgmt/tokengen',{
											       title:"Generate Token",											       
						                                   }
						              )
                          };
const genToken_post=async (req,res)=>{

	                            if(!req.session.loggedin)
	                            {
	                            	res.status(500).json(
			      		  	 		                      {
			      		  	 			                   msg:"error",
			      		  	 			                   msg2:"not logged in",
			      		  	 		                      }
							      		  	 		    );	
	                            }
	                            
								let present_user=req.session.loggedin.username;
								let Privilege=req.session.loggedin.privilege;
								let Tokenstring=req.body.Tokenstring;
								let privx=req.body.priv;
								// w2file(`created vars, user:${present_user},priv:${Privilege},token:${Tokenstring}`);
								if(Privilege==0)
								{
									
									res.status(500).json(
			      		  	 		                      {
			      		  	 			                   msg:"error",
			      		  	 			                   msg2:"not enough privilege",
			      		  	 		                      }
							      		  	 		    );
								}
								await regtoken.findOne(
												{
												  Tokenstring:Tokenstring,
												  Privilege:privx,	
												}
									         ).exec()
								              .then(
									         		doc=>{
									         			  if(doc)									         			  	
									         			  res.status(500).json(
								      		  	 		                      {
								      		  	 			                   msg:"duplicate_error",
								      		  	 			                   msg2:"This is strange, please try again",
								      		  	 		                      }
							      		  	 		    					  );
									         			  
									         			 }

									         ).catch(err=>
									         			  {
									         			  	
									         			  	res.status(500).json(
								      		  	 		                      {
								      		  	 			                   msg:"validation_error",
								      		  	 			                   msg2:"error while validating token",
								      		  	 		                      }
							      		  	 		    						);									         			  	
									         			  }
									         );
								
								let tok=new regtoken(
													  {
													  	Tokenstring:Tokenstring,
													  	Creator:present_user,
													  	Privilege:privx,
													  }
									                );
								
								tok.save()
								   .then(
								   			result=>{
								   						res.status(201).json(
			      		  	 		                      {
			      		  	 			                   msg:"ok",
			      		  	 			                   msg2:"New Token Generated",
			      		  	 		                      }
							      		  	 		    );
								   			        }
								   	    )
								   .catch(err=>
								   			 {
								   			 	w2file('error at 223');
								   			 	res.status(500).json(
			      		  	 		                      {
			      		  	 			                   msg:"error",
			      		  	 			                   msg2:"error while trying to save token",
			      		  	 		                      }
							      		  	 		    );
								             }
								        );

							   };
const privilegeCheck=(req,res,next)=>{
									
									if(req.session.loggedin.privilege!=1)
										{
											res.render('infoPage',{
															       title:"Error",
															       img:"edd.jpg",
															       info:"You dont have the privilege to access this page",
						                          				  }
									                   );
										}
										else
											return next();
									
							   };
const kitchuCheck=(req,res,next)=>{
									
									if(req.session.loggedin.user=="kitchu")
										{
											res.render('infoPage',{
															       title:"Error",
															       img:"edd.jpg",
															       info:"You cant access this page unless you are kitchu",
						                          				  }
									                   );
										}
									else
										return next();
									
							   };
const tokenInfo=(req,res)=>{
							
							regtoken.find()
							        .lean()
							        .exec()
							        .then(							        	
								        	docs=>{
								    			    // w2file(docs.length+ " records found ");
								    				res.render('UserMgmt/tokeninfo',
								    					                {
								    					                  title:"All tokens",
								    					                  entries:docs,
								    					                }
								    					      );
								    			  }							        	
							        	 )
							        .catch(err=>
							    	        res.render('infoPage',{
															       title:"Error",
															       img:"edd.jpg",
															       info:"There was a problem loading the page",
						                          				  }
						                              )
							    	  );

						   };
const userInfo=(req,res)=>{
							user.find({})
							    .lean()
							    .exec()
							    .then(
							    		docs=>{
							    			    w2file(docs.length+ " records found ");
							    				res.render('UserMgmt/userinfo',
							    					                {
							    					                  title:"User Info",
							    					                  entries:docs,
							    					                }
							    					      );
							    			  }
							    	 )
							    .catch(err=>
							    	        res.render('infoPage',{
															       title:"Error",
															       img:"edd.jpg",
															       info:"There was a problem loading the page",
						                          				  }
						                              )
							    	  );
						  };
module.exports={
				register,
				login,
				reg_user,
				login_user,
				logout,
				welcome,
				infopage,
				userInfo,
				genToken,
				genToken_post,
				tokenInfo,
				privilegeCheck,
				kitchuCheck,
			   };