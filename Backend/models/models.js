const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
  password: { type: String, required: true },
  photo: { type: String},
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],

});
const USER = mongoose.model('User', userSchema);
module.exports = USER;