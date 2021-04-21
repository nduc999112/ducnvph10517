const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://hiiamduc1:hiiamduc123@cluster0.11jum.mongodb.net/tinder?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,

})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected!!!!')
});
const user=new mongoose.Schema({
    name:String,
    username: String,
    birthday:Date,
    password: String,
    email: String,
    number_phone: String,
    sex:String,
    hobby:String,
    about:String,
    images: String
},);
const model=mongoose.model('ups',user);
module.exports=model;
