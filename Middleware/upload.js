const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'docs')
  },
  filename: function (req, file, cb) {
     cb(null,Date.now()+"-"+file.originalname)
  }
});


module.exports.upload = () => {
    return multer({
        storage: storage,
        dest: 'docs/',
    })
}

module.exports.uplaodSingle =() =>{
  return multer({
       storage:multer.memoryStorage()
  }); 
}
