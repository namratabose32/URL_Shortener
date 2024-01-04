const express=require('express');
const app=express();

const path=require('path');
const {connectToMongoDB}=require('./connect');
const urlRoute=require('./routes/url');
const URL = require('./models/url');
const staticRoute=require('./routes/staticRouter')

const PORT=8001;

connectToMongoDB('mongodb+srv://namratabose322:namratabose32@cluster0.hfublfb.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log("MongoDb connected"));

app.set("view engine","ejs");
app.set('views',path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.get("/test",async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render('home',{
        urls:allUrls,
    })
}) 

app.use("/url",urlRoute);
app.use('/',staticRoute)
app.get('/url/:shortId', async (req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },{$push:{
        visitHistory:{
            timestamp:Date.now(),
        }
    }})
    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>console.log(`Server running on PORT :${PORT}`))
