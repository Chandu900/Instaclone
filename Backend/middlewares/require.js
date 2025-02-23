const { jwt_secret } = require("../keys");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const USER = mongoose.model('User');


module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  
  
  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwt_secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must have logged in 2" });
    }
    const { _id } = payload;
    USER.findById(_id).select('-password').then((userData) => {
      req.user = userData;
      next();
    });
  });
};
