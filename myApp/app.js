const { openDelimiter } = require('ejs');
var express = require('express');
var path = require('path');
var fs = require('fs');
const { compileFunction } = require('vm');
var app = express();
const oneDay = 1000 * 60 * 60 * 24;
const sessions = require('express-session');
const cookieParser = require("cookie-parser");



////

////
// var sessiion=require('express-session');
// var flush=require('connect-flash');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));
app.use(cookieParser());

/*app.use(sessiion({
  secret:'secret',
  cookie:{maxAge:60000},
  resave:false,
  saveUninitialized:false
}));

app.use(flush());*/

/*var x={name:"Ali" ,age:27,username:"ali92",password:"abc123"};
var y=JSON.stringify(x);
fs.writeFileSync("users.json",y);

var data=fs.readFileSync("users.json");
var z=JSON.parse(data);*/

var output;
var client;
var items=[];
var x;



//Mongo atlas connection
async function main(){

  //import our MongoClient
  var  { MongoClient }= require('mongodb');

  //use url
  var uri="mongodb+srv://admin:admin@cluster0.0fmo8.mongodb.net/firstdb?retryWrites=true&w=majority"

  //create a new client--> we use it to connect to our databse using this url
  client=new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology:true});

  //we have to wait for the client to connect before you proceed with the next lines
  await client.connect();

  //create secondcollection
  //await client.db('firstdb').createCollection("secondcollection");

  //store data inside a collection(JSON object)
  //var user={username:"User1",password:"Pass1"};
  //var user2={username:"User2",password:"Pass2"};
  //insert data into my firstcollection in my first database
  //await client.db('firstdb').collection('firstcollection').insertOne(user);
  //await client.db('firstdb').collection('firstcollection').insertOne(user2);

  //retreive date from database
  output= await client.db('firstdb').collection('firstcollection').find().toArray();
  //items=  await client.db('firstdb').collection(x).find().toArray();
  

  //we have to close the connection before running your application
}

main().catch(console.error);



//Login
app.get('/',function(req,res){
  
  res.render('login',{alert:req.query.alert});
});

app.post('/',async function(req,res){
 
  output= await client.db('firstdb').collection('firstcollection').find().toArray();
  x =req.body.username;
  //req.session.use =req.body.username;
  var y=req.body.password;

  var found=false;
  for(var i=0;i<output.length;i++)
  {
    var z=output[i];
    if(z.username==x && z.password==y)
    {
     
      req.session.userid = x;
      res.redirect('/home');
      found=true;
      //items= client.db('firstdb').collection(req.session.userid).find().toArray();
    }
  }
    if(found==false)
    {
      res.render('login',{alert:"Invalid Username/Password"});
    }
});

async function dis(y){
  items=  await client.db('firstdb').collection(y).find().toArray();
}


//Registration
app.get('/registration',function(req,res){
  
  res.render('registration',{alert:req.query.alert});
});

app.post('/register',function(req,res){
 
  //session.userid =req.body.username;
  x=req.body.username;
  var y=req.body.password;

  var taken=false;
  var isNull=false;

  if((x=== null && y === null )||(x=== "" && y === "") )
  {
      res.render('registration',{alert:"Please enter username and password"});
      isNull=true;
      return;
  }

  if(x===null || x==="")
    {
      res.render('registration',{alert:"Please enter a username"})
      isNull=true;
      return;
    }

    if(y===null || y==="")
    {
      res.render('registration',{alert:"Please enter a password"});
      isNull=true;
      return;
    }
  for(var i=0;i<output.length;i++)
  {
    var z=output[i];
  
    if(z.username==x )
    {
      res.render('registration',{alert:"This username is already taken"});
      taken=true;
    }
  }
    if(taken==false && isNull==false)
    {
      var user={username: x,password: y};
      session = req.session;
      session.userid = x;
      client.db('firstdb').collection('firstcollection').insertOne(user);
      client.db('firstdb').createCollection(x);
      res.redirect('/home');
      
    }
});

//////
app.get('/home',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }

  res.render('home');
})

app.get('/phones',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('phones');
})

app.get('/iphone',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  else{
    res.render('iphone',{alert:""});
  }
})

app.post('/iphone',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="iPhone 13 Pro")
    {
      found=true;
      res.render('iphone',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"iPhone 13 Pro"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('iphone',{alert:"Item is added successfully",result3:items});
    
    }
})

app.get('/galaxy',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('galaxy',{alert:""});
})
app.post('/galaxy',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="Galaxy S21 Ultra")
    {
      found=true;
      res.render('galaxy',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"Galaxy S21 Ultra"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('galaxy',{alert:"Item is added successfully",result3:items});
    
    }
})

app.get('/books',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('books');
})

app.get('/leaves',function(req,res){
  if(!req.session.userid){
    res.redirect('/');

    return;
  }
  res.render('leaves',{alert:""});
})
app.post('/leaves',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="Leaves of Grass")
    {
      found=true;
      res.render('leaves',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"Leaves of Grass"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('leaves',{alert:"Item is added successfully",result3:items});
    
    }
})

app.get('/sun',function(req,res){
  if(!req.session.userid){
    res.redirect('/');


    return;
  }
  res.render('sun',{alert:""});
})
app.post('/sun',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="The Sun and Her Flowers")
    {
      found=true;
      res.render('sun',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"The Sun and Her Flowers"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('sun',{alert:"Item is added successfully",result3:items});
    
    }
})

app.get('/sports',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('sports');
})

app.get('/tennis',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('tennis',{alert:""});
})
app.post('/tennis',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="Tennis Racket")
    {
      found=true;
      res.render('tennis',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"Tennis Racket"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('tennis',{alert:"Item is added successfully",result3:items});
    
    }
})

app.get('/boxing',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('boxing',{alert:""});
})
app.post('/boxing',async function(req,res){
  var found=false;
  await dis(req.session.userid);
  console.log(items);
  for(var i=0;i<items.length;i++)
  {
    z=items[i];
    if(z.itemname==="Boxing Bag")
    {
      found=true;
      res.render('boxing',{alert:"Item is already in your cart",result3:items});
      return;
    }
  }

    if(found===false)
    {
      var ip={itemname:"Boxing Bag"};
      client.db('firstdb').collection(req.session.userid).insertOne(ip);
      res.render('boxing',{alert:"Item is added successfully",result3:items});
    
    }
})


//Cart
app.get('/cart',async function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  await dis(req.session.userid);
  var displ=[];
  var j=0;
  for(var i=0;i<items.length;i++)
  {
     var m=items[i];
     displ.push(m.itemname);

  }
  res.render('cart',{alert:"",result3:displ});
 
})


//Search
app.get('/searchresults',function(req,res){
  if(!req.session.userid){
    res.redirect('/');
    return;
  }
  res.render('searchresults',{alert:req.query.alert})
})

var item=["iPhone 13 Pro","Galaxy S21 Ultra","Leaves of Grass","The Sun and Her Flowers","Boxing Bag","Tennis Racket"];

app.post('/Search',function(req,res){
 
  var j = 0;
  var result=[];
  var searched =(req.body.Search).toLowerCase();
  for(var i = 0; i < item.length; i++){
    var itemName= item[i].toLowerCase();
      if(itemName.includes(searched)){
          result[j] = item[i];
          j++;
      }
  }
  
  if(result.length==0)
  {
    res.render("searchresults",{alert:"No Item Is Found",result2:result});
   
    return;
  }

  res.render("searchresults",{alert:"",result2:result});
})


//
if(process.env.PORT) {
  app.listen(process.env.PORT,function() {console.log('Server started')});
}
else {
  app.listen(3000,function() {console.log('Server started on port 3000')});
}