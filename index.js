import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
// import exphbs from 'express-handlebars'; // Uncomment this line if needed
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
const port = 8000;
const app = express();

app.use(express.static('public'));



app.use(express.json())

app.use(cors());
//registering the bodyparser
app.use(bodyParser.urlencoded({extended:false}))

//getting setting

//import settings from './config/settings.js';
const db = process.env.mongoURL;

mongoose
    .connect(db)
    .then(()=> console.log("MongoDb connected successfully"))
    .catch(err=>console.log(err));

// getting routes
import router from './routes/API/auth.js';

//mapping imported routes

app.get('/',(req,res)=>{
    res.send("Assignment4 code goes from here");
})
app.use('/api/auth',router);

import { jsonwtStrategy } from './strategies/jsonwtStrategy.js';
jsonwtStrategy(passport);

app.listen(port);


