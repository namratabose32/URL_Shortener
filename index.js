const express=require('express');
const app=express();

const {connectToMongoDB}=require('./connect');
const urlRoute=require('./routes/url');
const URL = require('./models/url');

const PORT=8001;

connectToMongoDB('mongodb+srv://namratabose322:namratabose32@cluster0.hfublfb.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log("MongoDb connected"));

app.use(express.json());

app.use("/url",urlRoute);

app.get('/:shortId', async (req,res)=>{
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
