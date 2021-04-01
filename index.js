var express=require('express');
var handlbars=require('express-handlebars');
const path=require('path');

var app=express();

app.use(express.static(path.join(__dirname,'src/public/css')))
app.use(express.static(path.join(__dirname,'src/public/fonts')))
app.use(express.static(path.join(__dirname,'src/public/js')))
app.use(express.static(path.join(__dirname,'src/public/img')))
app.use(express.static(path.join(__dirname,'src/public/bootstrap/css')))
app.use(express.static(path.join(__dirname,'src/public/bootstrap/js')))
console.log(__dirname)
app.engine('.handlebars',handlbars());
app.set('view engine','.handlebars');
app.set('views',path.join(__dirname,'src/resources/views/'));

app.get('/',function (req,res){
res.render('home');
})

app.get('/login',function (req,res){
    res.render('login');
})

app.get('/signup',function (req,res){
    res.render('signup');
})
app.listen(process.env.PORT || 8081);