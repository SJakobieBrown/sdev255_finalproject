const express = require('express')
const router = express.Router();
const courseController = require('../controllers/courseController');
const {requireAuth, requireTeacherAuth, requireStudentAuth} = require('../middleware/authMiddleware');
const {search_get, checkShoppingCartForCourse, checkStudentCoursesForCourse, checkTeacherCoursesForCourse} = require('../middleware/courseMiddleware');

router.get('/', requireAuth, courseController.course_index)
  
router.post('/', requireTeacherAuth, courseController.course_create_post);
  
router.get('/create', requireTeacherAuth, courseController.course_create_get);

router.get('/myCourses', requireAuth, courseController.myCourses_get);

router.get('/shoppingCart', requireStudentAuth, courseController.shoppingCart_get);

router.post('/shoppingCart/:id', requireStudentAuth, checkShoppingCartForCourse, checkStudentCoursesForCourse, courseController.shoppingCart_post);

router.delete('/shoppingCart/:id', requireStudentAuth, courseController.shoppingCart_delete);

router.post('/myCourses/:id', requireAuth, checkStudentCoursesForCourse, courseController.myCourses_post);

router.delete('/myCourses/:id', requireStudentAuth, courseController.myCourses_delete);

router.get('/search', requireAuth, courseController.search_get);

router.post('/search/:query', requireAuth, courseController.search_get);

//The following  must be at bottom of the script
router.get('/:id', requireAuth, courseController.course_details);

router.delete('/:id', requireTeacherAuth, checkTeacherCoursesForCourse, courseController.course_delete);

router.post('/:id', requireTeacherAuth, checkTeacherCoursesForCourse, courseController.course_edit);



module.exports = router;