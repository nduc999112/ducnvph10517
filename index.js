var express=require('express');
var handlbars=require('express-handlebars');
const path=require('path');
const bodyParser=require('body-parser');
// const mongoose=require('mongoose');
const userModel=require('./model/user');
const multer=require('multer');
var storage=multer.diskStorage({
    destination:"./src/public/uploads/",
    filename:function (req,file,cb){

        cb(null,Date.now()+file.originalname);
}
})

var upload=multer({storage:storage}).single('images')
var app=express();

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'src/public/css')))
app.use(express.static(path.join(__dirname,'src/public/fonts')))
app.use(express.static(path.join(__dirname,'src/public/js')))
app.use(express.static(path.join(__dirname,'src/public/img')))
app.use(express.static(path.join(__dirname,'src/public/bootstrap/css')))
app.use(express.static(path.join(__dirname,'src/public/bootstrap/js')))
app.use(express.static(path.join(__dirname,'src/public/uploads')))
console.log(__dirname)

app.engine('.handlebars',handlbars());
app.set('view engine','.handlebars');
app.set('views',path.join(__dirname,'src/resources/views/'));




app.get('/',function (req,res){
res.render('home');
console.log('sever connect')
})


app.get('/getuser',async (req,res)=>{
    var baseJSON={
        errorCode:undefined,
        errorMessage:undefined,
        user:undefined,
    }
    userModel.find({},
        function (err,user){
            if(err){
                baseJSON.errorCode=404
                baseJSON.errorMessage=err;
                console.log(err);
            }
            else {
                baseJSON.errorCode=200;
                baseJSON.errorMessage='OK';
                baseJSON.user=user;
            }
    res.send(baseJSON);
        }
    )
})

app.get('/login',function (req,res){
    res.render('login');
})

app.get('/signup',function (req,res){
    res.render('signup',);
})
app.get('/userdetail',function (req,res){
                userModel.find({}).then(userlist => {
                    res.render('userdetail',{
                        ups:userlist.map(user=>user.toJSON()),
                        username:req.body.username,
                    });
                })
})

app.post('/add',upload,async (req,res)=>{
    var username=req.body.username;
    userModel.findOne({
        username:username
    }).then(data=>{
       if(data){
           res.render('signup',{title:'user đã tồn tại'})
       }
       else {
           const file=req.file;
           const u=new userModel(req.body)
           userModel.create({
               username: req.body.username,
               password: req.body.password,
               name: req.body.name,
               email: req.body.email,
               number_phone: req.body.number_phone,
               images:  req.file.filename,
           })
       }})
            .then(data=>{
                    res.render('signup',{title:"Tạo tài khoản thành công Bấm vào đây để đăng nhâp"});
                        // res.json('Tạo tài khoản thành công')

                    })
                    .catch(err=>{
                        res.status(500).json('Tạo tài khoản thất bại');
console.log(err)
                    })
})

app.post('/userdetail',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    userModel.findOne({username:username},(err,foundResults)=>{
        if(err){
            res.render('login',{titlelogin:"KHÔNG CÓ NGƯỜI DÙNG NÀY"});
        }
        else {
            if(foundResults.password==password){
                userModel.find({}).then(userlist => {
                    res.render('userdetail',{
                        ups:userlist.map(user=>user.toJSON()),
                        username:req.body.username,
                    });
                })
            } else {
                res.render('login',{titlelogin:"Tên tài khoản hoặc mật khẩu sai"});
            }
        }
    })
})
// app.get('/list', (req,res)=>{
//     userModel.find({}).then(userlist => {
//         res.render('listuser',{
//             ups:userlist.map(user=>user.toJSON())
//         });
//     })
// });
//tim theo id
app.get('/:id',(req,res)=>{
    userModel.findById(req.params.id,(err,user)=>{
        if(!err){
            res.render('edit',{
                user:user.toJSON()
            })
        }
    })
})
    //edit user
app.post('/edit',(req,res,next)=>{

    userModel.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('/userdetail');
        }
        else {
            console.log(err);
        }
    })
})
//delete user
app.get('/delete/:id',async (req, res) => {
    try {
        const user=await userModel.findByIdAndDelete(req.params.id,req.body);
        if(!user){
            res.status(404).send('No item found');
        }
        else{
            res.redirect('/userdetail');
        }
    }
    catch (err){
        res.status(500).send(err);
    }
})


app.listen(process.env.PORT || 8081);
