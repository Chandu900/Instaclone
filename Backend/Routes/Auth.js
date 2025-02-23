const express = require('express');
const router = express.Router()
const mongoose=require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt');
const { jwt_secret } = require('../keys')
const jwt = require("jsonwebtoken");




//for create post 


router.post('/signup', (req, res) => {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
       return res.status(422).json({error:"please add all fields"})
    }

    User.findOne({$or:[{email},{userName}]}).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({error:"User already exist with this email or username"})
        }
        bcrypt.hash(password, 10).then((hashPassword) => {
            const user = new User({
              name,
              userName,
              email,
              password: hashPassword,
            });
            
              user.save()
              .then((user) => {
                return res.json({ message: "Registered successfully", user });
                
              })
              .catch((err) => {
                console.log(err);
                return res.status(422).json({error:err})
              });
             
         })//return kara hai hashed password
        
        
    })
})

//signIn route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add email and password" });
  }
  User.findOne({ email }).then((savedUser) => {
    
    
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      
      .then((match) => {
        if (match) {
          // return res.status(200).json({ message: "Signed in Successfully" })
          const token = jwt.sign({ _id: savedUser.id }, jwt_secret);
          const { _id, name, email, userName } = savedUser;

          res.json({ token, user: { _id, name, email, userName } });

          // console.log({ token, user: { _id, name, email, userName } });
          
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((err) => console.log(err));
  });
});


    

module.exports = router;