const express = require('express');
const cors=require('cors')
const app = express();
const {mongoURL} = require('./keys.js')
const mongoose = require('mongoose')
const userModel = require('./models/models.js')
const postModel = require('./models/post.js')
const path=require('path')



app.use(cors())
app.use(express.json())
app.use(require('./Routes/Auth.js'))
app.use(require('./Routes/post.js'))
app.use(require('./Routes/user.js'))
const PORT =5000;




//connect mongoDB
    mongoose.connect(mongoURL);
    mongoose.connection.on("connected", () => {
      console.log("successfully connected to mongoDB");
    });
    mongoose.connection.on("error", () => {
      console.log("not connected to mongoDB");
    });

//serving the frontend
app.use(express.static(path.join(__dirname,"./client/build")))
    // console.log(path.join(__dirname))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
    res.status(500).send(err)
  })
})





app.listen(PORT, () => {
    
    console.log(`server is running on :${PORT}`)
})
