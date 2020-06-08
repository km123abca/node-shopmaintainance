var fs = require("fs");
w2file=(datum)=>
				  {
				    fs.appendFile('./public/debug.txt',
				                           datum+'\n',
				                           function(err)
				                            {
				                              if(err) console.log('an error bruv');
				                            } 
				                  );
				  };
module.exports=w2file;