import mongoose from 'mongoose';


const NewsSchema = new mongoose.Schema({
    source: {
      id: {
        type: String,
        
      },
      name: {
        type: String,
        required: true
      }
    },
    author: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    url: {
      type: String,
      required: true
    },
    urlToImage: {
      type: String
    },
    publishedAt: {
      type: Date
    },
    savedAt:{
      type: Date
    },
    content: {
      type: String
    }
  });

const News = mongoose.model('news',NewsSchema);
export default News;