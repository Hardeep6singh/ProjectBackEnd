import mongoose from 'mongoose';
const Schema = mongoose.Schema

const PersonSchema = new Schema({
    firstName:{
        type : String,
    },
    lastName:{
        type : String,
        required: true   
    },
    email:{
        type : String,
        required: true
    },
    contact:{
        type : String,
        required: true
    },
    password :{
        type: String,
        required: true
    }
})

const Person = mongoose.model('users',PersonSchema);

export default Person;