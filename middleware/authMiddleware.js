const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Any User Auth
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check token exists
    if (token){
        jwt.verify(token, 'net ninja secret', (err, decodedToken) =>{
            if (err){
                console.log(err.message);
                res.redirect('/auths/login');
            }
            else{
                next();
            }
        });
    }
    else{
        res.redirect('/auths/login');
    }
}

// Teacher Role Auth
const requireTeacherAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
  
    // Check if token exists
    if (!token) {
      return res.redirect('/auths/login');
    }
  
    try {
      // Verify the token and get the decoded payload
      const decodedToken = jwt.verify(token, 'net ninja secret');
  
      // Find the user by their ID
      const user = await User.findById(decodedToken.id);
  
      // Check if the user is a teacher
      if (user.role === 'teacher') {
        next();
      } else {
        res.redirect('/');
      }
    } catch (err) {
      console.log(err.message);
      res.redirect('/auths/login');
    }
  };

  // Student Role Auth
const requireStudentAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
  
    // Check if token exists
    if (!token) {
      return res.redirect('/auths/login');
    }
  
    try {
      // Verify the token and get the decoded payload
      const decodedToken = jwt.verify(token, 'net ninja secret');
  
      // Find the user by their ID
      const user = await User.findById(decodedToken.id);
  
      // Check if the user is a teacher
      if (user.role === 'student') {
        next();
      } else {
        res.redirect('/');
      }
    } catch (err) {
      console.log(err.message);
      res.redirect('/auths/login');
    }
  };

// check current user
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, 'net ninja secret', async (err, decodedToken)=>{
            if (err){
                res.locals.user = null;
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else{
        res.locals.user = null;
        next();
    }
}
module.exports = {requireAuth, requireTeacherAuth, requireStudentAuth, checkUser};