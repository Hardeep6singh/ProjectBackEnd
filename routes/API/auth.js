import express from 'express';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import Jsonwt from 'jsonwebtoken';
import passport from 'passport';

import Person from './../../model/Person.js';
import News from './../../model/News.js';
import dotenv from 'dotenv';
dotenv.config();


const router = Router();
let token1 = '';

router.get('/new',(req,res)=>{
    res.send('Inside API Route');
})

//Route to register a user . Get request where user will enter registeration details
//router.get('/register',(req,res)=>{
//    res.render('register');
//})

router.use((req, res, next) => {
  
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    next();
  });

//Route to register a user. URL :/api/auth/register

router.post('/register',(req,res)=>{
    //check if username is already in collection.
    Person
        .findOne({email: req.body.email})
        .then(person=>{
            if(person){
                res.status(400).json({ success: false, message: 'Email Already registered' })
            }else{
                //add a new document to the colletion.
                const newPerson = Person({
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    email : req.body.email,
                    contact : req.body.contact,
                    password: req.body.password

                })
                //encrypting the password using bcrypt.js
                bcrypt.genSalt(10,(err,salt)=>{
                // salt is provided in salt variable.
                bcrypt.hash(newPerson.password, salt, (err,hash)=>{
                    if(err){
                        return res.status(400).send('Not registered, Contact Admin')
                    }else{
                        newPerson.password = hash
                        newPerson
                        .save()
                        .then(res.json({ success: true, message: 'User registered successfully' }))
                        .catch(err=>res.send(err));
                    }
                })
            })}
        })
        .catch(err=> res.send(err))
})

//Route where user will enter login details
/*router.get('/login',(req,res)=>{
    res.render('login')
})*/

// Adding JWT tokens while logging user
router.post('/login',(req,res)=>{
   let password = req.body.password
    
    Person
    .findOne({email: req.body.email})
    .then(person=>{
        if(person){
            bcrypt
                .compare(password,person.password)
                .then((isCompared)=>{

                    if(isCompared){

                       //generate jwt token
                       const payload ={
                        id:person.id,
                        email:person.email,
                        firstNamename:person.firstName
                       }
                        
                       Jsonwt.sign(
                        payload,
                        process.env.secret,
                        {expiresIn: 3600},
                        (err,token)=>{
                             token1 = token;  
                             res.setHeader('Authorization', 'Bearer '+token);                             
                             res.json({ success: true, message: 'Login successful' });
                        } )


                        
                    }
                    else{
                        res.status(401).send("<h1>Password not correct</h1>")
                    }}
                )
                .catch(err=> res.send(err))
            }
        else{
            res.status(401).send("User not registered")
        }
    })
})

//private route to get all user details by using JWT tokens
router.get('/news',
  passport.authenticate('jwt',{session:false}), //middleware from passport-jwt
  async (req,res)=>{
    let news_un = []
    const cursor = await News.find()
    cursor.forEach(news=>{``
        news_un.push(news)
    })
    const Articles = news_un.map(article => {
        return {
          title: article.title,
          description: article.description,
          url: article.url,
          savedAt: article.savedAt,
          urlToImage: article.urlToImage

        };
      });
      res.json(Articles);
    })

    router.post(
        '/savenews',
        (req, res) => {
            const article = req.body;
            const newNews = new News(article);
      
            News.findOne({ title: newNews.title })
            .then(news => {
              if (news) {
                res.status(400).send('<h2>Article already exists<h2>');
              } else {
                newNews
                  .save()
                  .then(res.json({ success: true, message: 'News article saved successfully' }))
                  .catch(err => res.send(err));
              }
            })
            .catch(err => res.send(err));
        }
      );

export default router;
