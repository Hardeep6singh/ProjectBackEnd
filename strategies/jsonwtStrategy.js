import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
const Person = mongoose.model('users')
//getting setting
import dotenv from 'dotenv';
dotenv.config();

import settings  from '../config/settings.js';

const key = process.env.secret

var opts={}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = key

const jsonwtStrategy = (passport)=>{
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
        Person.findById(jwt_payload.id)
        .then((person)=>
        {
            if(person){
                return done(null,person)
            }
            else{
                return done(null,false)
            }
        }
        )
        .catch(err=>console.log(err))
    })
    )
}

export { jsonwtStrategy };