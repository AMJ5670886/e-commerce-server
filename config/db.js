const mongoose = require("mongoose");
const config = require("./keys");
const db = config.mongoURI;

mongoose.set("strictQuery", false);

// const connectDB = async () => {
//     try{
//         await mongoose.connect(db, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Connected to DB");
//     }catch (err){
//         console.log("Connection failed");
//         process.exit(1);
//     }
// };
const connectDB = async () => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log("Connected to DB");
    }catch (err){
        console.log("Connection failed");
        process.exit(1);
    }
};

module.exports = connectDB;