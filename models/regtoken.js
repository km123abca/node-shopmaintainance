var mongoose=require('mongoose');
var Schema  =mongoose.Schema;
var schema 	=new Schema(
						   {							
							Datex       :{type:String,default:Date.now()}, 
							Privilege   :{type:String,required:true},
							Tokenstring :{type:String,required:true}, 
							Creator     :{type:String,required:true},
							Consumer    :{type:String,default:"none"},                                              							
						   }
					 	);
module.exports =mongoose.model('regtoken',schema);