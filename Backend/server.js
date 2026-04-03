

import express from "express";
import mongoose from "mongoose";
const app = express();


mongoose.connect("mongodb://dasarimadurimadhu_db_user:password@ac-ytcg5tp-shard-00-00.ewl5irx.mongodb.net:27017,ac-ytcg5tp-shard-00-01.ewl5irx.mongodb.net:27017,ac-ytcg5tp-shard-00-02.ewl5irx.mongodb.net:27017/?ssl=true&replicaSet=atlas-1aos04-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("✅ DB connected"))
.catch(err => console.log("❌ Error:",err.message));


app.listen(8080,()=>{
    console.log("the port is running");
    
})