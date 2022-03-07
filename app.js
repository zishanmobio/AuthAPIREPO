require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port =process.env.PORT || 8082;
const multer = require('multer');
const path = require('path');
const UserRoute = require('./Route/userRoute'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'upload')
  },
  filename: function (req, file, cb) {
     cb(null,Date.now()+"-"+file.originalname)
  }
});

const filefilter = (req, file, cb) => {
 
 if (file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.minetype==='image/jpeg'
 ) {
   cb(null, true); 
 }
 else {
   cb(null, false);
 }
}

app.use('/upload', express.static(path.join(__dirname, 'upload')));


// app.use(bodyParser.urlencoded({ extended:false}))
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods","GET,POST, PUT ,DELETE ,PATCH");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
    next();
 });

app.use(multer({
    dest: 'upload/',
    storage: storage,
    fileFilter: filefilter
}).single('image'));

app.use('/api/user',UserRoute);

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
    .then(result => {
       
        // console.log("database connected successfully") 
        app.listen(port, (err) => {
            if (err) {
                console.log("something error in server", err);
                return;
            }
            console.log(`server running on port no ${port}`);
        });
    })
   .catch(err => console.log(`Error in DB Connection ${err}`));
 