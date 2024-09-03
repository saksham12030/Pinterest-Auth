// multer.diskStorage() creates a storage engine with the following configuration:
// destination: This function specifies the directory where uploaded files will be stored. In this case, it's set to 'uploads/'.
// filename: This function specifies how the file should be named when it's saved. In this case, it generates a unique filename using UUID (uuidv4() was replaced with uuid(), which is the correct function call in the given context).
// When a file is uploaded, Multer will use these functions to determine where to store the file and what name to give it.
const multer=require("multer");
const path=require("path");
const {v4:uuidv4} = require("uuid");
const storage= multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'./public/images/uploads')
    },
    filename:function(req,file,cb){
        // file.originalname => Name of the file on the user's computer...
        // path.extname("file.pdf") => FOR EXTRACTING THE EXTENSION...
        const uniquename=uuidv4();
        cb(null,uniquename+path.extname(file.originalname));
    }
});
const upload= multer({storage:storage});
module.exports=upload;