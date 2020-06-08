var mongoose=require('mongoose');
var Schema  =mongoose.Schema;
var schema 	=new Schema(
						   {
							Bill_id    :{type:String,required:true},
							Product_id :{type:String,required:true},                            
                            Qty        :{type:Number,required:true},                            							
						   }
					 	);
module.exports =mongoose.model('sales',schema);