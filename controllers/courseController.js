const { get, indexOf } = require('lodash');
const Course = require('../models/course');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const course_index = (req, res)=>{
    Course.find().sort({ createdAt: -1})
    .then((result)=>{
      res.render('courses/index', { title: 'Courses', courses: result});
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  
   const course_create_post = async (req,res)=>{
    const course = new Course(req.body);
    const user = await User.findById(jwt.verify(req.cookies.jwt, 'net ninja secret').id);
    course.save();
    user.courses.push(course._id);
    user.save()
      .then((result)=>{
        res.redirect('/')
      })
      .catch((err)=>{
        console.log(err)
      })  
    }
  
  const course_create_get = (req, res) => {
    res.render('courses/create', { title: 'Create a new course'});
  }
  
  const course_details = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(jwt.verify(req.cookies.jwt, 'net ninja secret').id);
    Course.findById(id)
      .then(result => {
        const auth = user.courses.some(e => e._id.equals(result._id)) && user.role === "teacher";
        res.render('courses/details', { course: result, title: 'Course Details', verified: auth });
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const course_delete = (req, res) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id)
      .then(async result => {
        const users = await User.find();
        users.forEach((user)=>{
          user.shoppingCart.pull(result._id)
          user.courses.pull(result._id)
          user.save()
        })

        res.json({ redirect: '/' });
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const course_edit = (req, res) => {
    const id = req.params.id;
    console.log("course id: " + id)
    Course.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedCourse => {
      res.redirect('/courses/' + updatedCourse.id);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const myCourses_get = async (req, res)=>{
    const user = await User.findById(jwt.verify(req.cookies.jwt, 'net ninja secret').id);
    let userCourses = [];
    for (let i = 0; i< user.courses.length; i++){
      userCourses.push(await Course.findById(user.courses[i]))
    }
    res.render('courses/myCourses', { title: 'My Courses', courses: userCourses});
  }

  const shoppingCart_get = async (req, res)=>{
    const user = await User.findById(jwt.verify(req.cookies.jwt, 'net ninja secret').id);
    let userCourses = [];
    for (let i = 0; i< user.shoppingCart.length; i++){
      userCourses.push(await Course.findById(user.shoppingCart[i]))
    }
    console.log(userCourses)
    res.render('courses/shoppingCart', { title: 'Shopping Cart', courses: userCourses});
  }
    
  

  const shoppingCart_post = async (req, res) => {
    try {
      const id = req.params.id;
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, 'net ninja secret');
      const course = await Course.findById(id);
      const user = await User.findById(decodedToken.id);
      user.shoppingCart.push(course._id);
      user.save()
      .then((result)=>{
        res.json({redirect:'/courses/shoppingCart'})
      })
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  
  const shoppingCart_delete = async (req,res)=>{
    try{
      const id = req.params.id;
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, 'net ninja secret');
      const course = await Course.findById(id);
      const user = await User.findById(decodedToken.id);
      user.shoppingCart.pull(course._id);
      user.save()
      .then((result)=>{
        console.log(result)
        res.json({redirect:'/courses/shoppingCart'})
      })
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  const myCourses_post = async(req,res)=>{
    try {
      const id = req.params.id;
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, 'net ninja secret');
      const course = await Course.findById(id);
      const user = await User.findById(decodedToken.id);
      user.courses.push(course._id);
      user.shoppingCart.pull(course._id);
      user.save()
      .then((result)=>{
        res.redirect('/courses/myCourses')
      })
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  const myCourses_delete = async (req, res) =>{
    try{
      const id = req.params.id;
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, 'net ninja secret');
      const course = await Course.findById(id);
      const user = await User.findById(decodedToken.id);
      user.courses.pull(course._id);
      user.save()
      .then((result)=>{
        res.json({redirect:'/courses/myCourses'})
      })
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  const search_get = async (req,res)=>{
    const query = req.params.query;
    const courses = []
    if(query === ""){
      res.render('courses/search', {title: 'Search results', courses})
    }
    const allCourses = await Course.find();
    console.log(query)

    allCourses.forEach(course=>{
      if(course.courseName.toUpperCase() === query.toUpperCase() || course.subjectArea.toUpperCase() === query.toUpperCase() || course.creditHours === query){
        courses.push(course);
      }
    })
    console.log(courses)
    res.render('courses/search', {title: 'Search results', courses})
  }
  module.exports = {
    course_index,
    course_create_get,
    course_create_post,
    course_delete,
    course_details,
    course_edit,
    shoppingCart_get,
    myCourses_get,
    myCourses_post,
    myCourses_delete,
    shoppingCart_post,
    shoppingCart_delete,
    search_get
  }