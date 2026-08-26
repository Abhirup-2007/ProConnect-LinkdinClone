import mongoose from "mongoose";
import dns from "dns"

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

function connectDB(){
    mongoose.connect("mongodb+srv://inabhirup_db_user:e49S4lNfnBooakp1@cluster0.ganmpke.mongodb.net/?appName=Cluster0")
    .then(()=>{
        console.log("connected to database")
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default connectDB;