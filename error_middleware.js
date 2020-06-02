
const notFound= (req,res,next)=>
 				 {
 				 	const error=new Error('Not Found=>'+req.originalUrl);
 				 	error.status=404;
 				 	next(error);
 				 };



const errorHandler=(error,req,res,next)=>
					  {
					  	res.status(error.status||500);
					  	res.json(
					  				{
					  					error:{message:error.message},
					  					stack:process.env.NODE_ENV=='production'?'You Are Lost':error.stack
					  				}
					  			);
					  };

module.exports={
				notFound,
				errorHandler,
			   };
	  