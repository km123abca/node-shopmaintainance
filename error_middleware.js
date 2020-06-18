
const notFound= (req,res,next)=>
 				 {
 				 	const error=new Error('Not Found=>'+req.originalUrl);
 				 	error.status=404;
 				 	var image_loc="./uploads/cena.jpg";
 				 	res.status(404);
 				 	res.render('page404',{imloc:image_loc});
 				 	// next(error);
 				 };



const errorHandler=(error,req,res,next)=>
					  {
					  	res.status(error.status||500);
					  	res.json(
					  				{
					  					// message:"This is the bottom most trickle down layer, there was an error",
					  					message:error.message,
					  					error:{message:error.message},
					  					// error:"ero",
					  					stack:process.env.NODE_ENV=='production'?'You Are Lost':error.stack
					  				}
					  			);
					  };

module.exports={
				notFound,
				errorHandler,
			   };
	  