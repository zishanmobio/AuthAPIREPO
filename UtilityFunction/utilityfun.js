const fs = require('fs');

exports.DeleteFile = (filepath) => {
    
    console.log(filepath, " ", fs.existsSync(filepath)); 

    if(!fs.existsSync(filepath)) 
       console.log("no path exists !!!")  
    else {
       fs.unlink(filepath, function (err) {            
              if (err) {                                                 
                  console.error(err);
                return;  
              }                                                          
            console.log('File has been Deleted');                           
        });     
     }

}
