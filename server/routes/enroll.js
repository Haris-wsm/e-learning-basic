const router = require('express').Router();

// middleware
const AuthorizatioMiddleware = require('../middleware/auth');
const ErrorHanlder = require('../errors/ErrorHanlder');

//Services
const EnrollService = require('../services/enroll');

const UserDTO = require('../dtos/user-dto');
const CourseDTO = require('../dtos/course.dto');
const { Router } = require('express');

// library

router.use(AuthorizatioMiddleware.accessTokenAuthentication);

router.get('/enroll/courses', async (req, res, next) => {
  try {
    const courses = await EnrollService.getCourses(req.query.type, req.user);

    const coursesData = courses.map((course) => {
      course.owner = new UserDTO(course.owner);
      course.professers = course.professers.map(
        (professer) => new UserDTO(professer)
      );
      return new CourseDTO(course);
    });

    res.send({ courses: coursesData });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get('/enroll/assignments', async (req, res, next) => {
  try {
    const assignment = await EnrollService.getAssignments(req.user._id);
    res.send({ assignment });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get('/enroll/assignments/:assignmentId', async (req, res, next) => {
  try {
    const assignment = await EnrollService.getAssignmentsById(
      req.params.assignmentId
    );

    res.send({ assignment });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.post('/enroll/courses', async (req, res, next) => {
  try {
    const newCourse = EnrollService.createEnroll(req.body, req.user);
    res.send({ course: newCourse });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

module.exports = router;
