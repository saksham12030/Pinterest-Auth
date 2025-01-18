var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload=require("./multer");

router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  // jo file upload hui hai use save karo as a post and uska postid user ko do and post ko user id do
  const user=await userModel.findOne({username:req.session.passport.user,});
  const post=await postModel.create({
    image:req.file.filename,   //req.file.filename contain the name of the file...
    imageText:req.body.filecaption,   //
    user:user._id,
  })
  user.post.push(post._id);   // post._id is the id of 8 newly created post...
  await user.save();
  res.redirect("profile");
});


router.get('/profile',isLoggedIn,async function(req,res,next){
    const user=await userModel.findOne({username:req.session.passport.user,}).populate("post");
    console.log(user);
    res.render("profile",{user});
})

router.post('/register',function(req,res){
  const { username,email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  try {
    userModel.register(userData,req.body.password)
    .then(function(){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile");
      })
    })
    
  } catch (error) {
    res.json({"error":error})
  }
})

router.post("/login",passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
