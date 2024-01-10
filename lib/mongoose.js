import mongoose from "mongoose";

export async function initMongoose(){
    if(mongoose.connection.readyState===1){
       return mongoose.connection.asPromise();  
    }
   return await mongoose.connect(process.env.MONGODB_URL);
}

// connectToDatabase - 
//                     1. Products.js(file to store data)
//                     2. /lib/mongoose.js(file  to connectTo DataBase)
//                     3. /model(model of our perticular Data)
// possible Errors -
//                     1.(connection string Password has @ or other sesitive char)
//                     2.(dataBase current ip_address not enabled or restricted)