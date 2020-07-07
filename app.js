const express= require('express');
const morgan=require('morgan');
const expressHbs=require('express-handlebars');
const mongoose=require('mongoose');

// mongoose.connect(process.env.DB_CONN_STR,
// 				  {useNewUrlParser:true,useUnifiedTopology:true}
// 				);
mongoose.connect('mongodb://localhost:27017/node-billing',{ useNewUrlParser: true,useUnifiedTopology: true});
const bodyParser=require('body-parser');





const err_mid =require('./error_middleware');
const path = require('path');
const inventoryRoutes=require('./routes/inventory');
const salesRoutes=require('./routes/sales');
const userRoutes=require('./routes/usermgmt');

const app=express();


app.use(
		(req,res,next)=>
						{
							res.header('Access-Control-Allow-Origin','*');
							res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
							if(req.method==='OPTIONS')
							{
								res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
								return res.status(200).json({}); 
							}
							next(); //so that the flow may continue
						}
	   );






app.engine('.hbs',expressHbs(
	                           {
	                           	defaultLayout:'Layout',
	                           	extname:'.hbs'
	                           }
	                         )
          );
app.set('view engine','.hbs');

// app.engine('.hbs',expressHbs({defaultLayout:'Layout',extname:'.hbs'}));
// app.set('view engine', '.hbs');


app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
app.use(session( 
	            {
	            	secret:'apple',
	            	resave:false,
	            	saveUninitialized:false,
	            	store:new MongoStore({mongooseConnection:mongoose.connection}),
	            	cookie:{maxAge: 180*60*1000}
	            } 
	           )
       );

app.use(
			function(req,res,next)
				{
					if(!req.session.loggedin || req.session.loggedin=={})
						{
						res.locals.loggedin=false;
						}
					else
						{
						res.locals.loggedin=true;
						res.locals.userx=req.session.loggedin.username;
						res.locals.userprivilege=req.session.loggedin.privilege;
						if(res.locals.userprivilege==1)
							res.locals.privilegedUser=true;
						else
							res.locals.privilegedUser=false;
						}
					/*	
					if(!req.session.error_messages || req.session.error_messages.length==0)
						res.locals.error_messages=[];
					else
						res.locals.error_messages=req.session.error_messages;
					req.session.error_messages=[];*/
					next();
				}
	   );




app.use('/inventory',inventoryRoutes);
app.use('/sales',salesRoutes);
app.use('/user',userRoutes);
app.use(err_mid.notFound);
app.use(err_mid.errorHandler);
module.exports=app;