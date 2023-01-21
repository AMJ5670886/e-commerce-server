const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

//CONNECTED TO MONGODB
connectDB();

//MIDDLEWARE
app.use('/api/users',require('./routes/userApi'));
app.use('/api/products',require('./routes/productsApi'));

app.get('/',(req,res)=>{
    res.send("My App is running");
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})