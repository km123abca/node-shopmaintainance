var mongoose=require('mongoose');
var Schema  =mongoose.Schema;
var schema 	=new Schema(
						   {
							Bill_id :{type:Number,required:true},
							Datex   :{type:String,default:Date.now()},                                               							
						   }
					 	);
module.exports =mongoose.model('bills',schema);