const { check } = require('express-validator');
const CourseServices = require('../../services/course');
class CourseValidation {
  postRequestBody() {
    return [
      check('name')
        .notEmpty()
        .withMessage('Course name is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 characters long'),
      check('date').notEmpty().withMessage('Course must have time shcedule')
    ];
  }

  postRequestBodyLesson() {
    return [
      check('name')
        .notEmpty()
        .withMessage('Course name is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 characters long')
        .custom(async (name) => {
          const lesson = await CourseServices.getLesson({
            name
          });

          if (lesson) {
            throw new Error('Name already exists in this course');
          }
          return true;
        }),
      check('duration')
        .notEmpty()
        .withMessage('Course name is required')
        .bail()
        .isNumeric()
        .withMessage('Duration must be a number')
    ];
  }

  postRequestBodyVideoUpload() {
    return [
      check('name').notEmpty().withMessage('Name must not be empty'),
      check('title').notEmpty().withMessage('Title must not be empty'),
      check('video')
        .notEmpty()
        .withMessage('Video must not be empty')
        .bail()
        .custom((video) => {
          if (!video) throw new Error('Video must be specified');
        })
    ];
  }

  postRequestBodyAssignment() {
    return [
      check('ref').notEmpty().withMessage('Lesson must not be empty'),
      check('title').notEmpty().withMessage('Title must not be empty'),
      check('content').notEmpty().withMessage('Content must not be empty'),
      check('date').notEmpty().withMessage('Date must not be empty')
    ];
  }

  putRequstBodyLesson() {
    return [
      check('name').notEmpty().withMessage('Name must not be empty'),
      check('duration')
        .notEmpty()
        .withMessage('Duration must not be empty')
        .bail()
        .isNumeric()
        .withMessage('Duration must be a number')
    ];
  }
}

module.exports = new CourseValidation();
