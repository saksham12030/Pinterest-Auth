const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
    default:""
  },
  image:{
    type:String,
  },
  user:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  currentDateAndTime: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default:[],
  },
});

module.exports= mongoose.model('Post', postSchema);
