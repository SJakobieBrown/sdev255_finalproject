const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Course = require('../models/course');
const { json } = require('stream/consumers');
const { receiveMessageOnPort } = require('worker_threads');
module.exports.checkShoppingCartForCourse = async (req, res, next) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, 'net ninja secret');
    const user = await User.findById(decodedToken.id);
    const course = await Course.findById(id);
    if(!user.shoppingCart.some(e => e._id.equals(course._id))){
        next();
    } else{
        res.json({redirect: '/courses/'+id})
    }
}
module.exports.checkStudentCoursesForCourse = async (req, res, next) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, 'net ninja secret');
    const user = await User.findById(decodedToken.id);
    const course = await Course.findById(id);
    if(!user.courses.some(e => e._id.equals(course._id))){
        next();
    } else{
        res.redirect('/courses/shoppingCart')
    }
}
module.exports.checkTeacherCoursesForCourse = async (req, res, next) =>{
    const id = req.params.id;
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, 'net ninja secret');
    const user = await User.findById(decodedToken.id);
    const course = await Course.findById(id);
    if(user.courses.some(e => e._id.equals(course._id))){
        next();
    } else{
        res.redirect('/')
    }
}