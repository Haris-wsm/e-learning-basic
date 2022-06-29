const router = require('express').Router();
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

// libary

const { validationResult } = require('express-validator');
const videoDuration = require('get-video-duration');
// middleware
const AuthorizatioMiddleware = require('../middleware/auth');
const CourseValidation = require('../middleware/validation/Course');
const ErrorHanlder = require('../errors/ErrorHanlder');
const ValidationError = require('../errors/ValidationError');

// services
const CourseService = require('../services/course');
const uploadImage = require('../middleware/upload');
const AttachmentServices = require('../services/attachments');

router.use(AuthorizatioMiddleware.accessTokenAuthentication);
router.use(AuthorizatioMiddleware.restrictByRole(['teacher', 'student']));

const CourseDTO = require('../dtos/course.dto');
const UserDTO = require('../dtos/user-dto');
const Course = require('../model/Course/Course');

router.get('/courses', async (req, res, next) => {
  try {
    let courses;
    if (req.user.role === 'teacher') {
      courses = await CourseService.getAll({ owner: req.user._id });
    } else {
      courses = await CourseService.getAll({});
    }

    const coursesData = courses.map((course) => {
      course.owner = new UserDTO(course.owner);
      course.professers = course.professers.map(
        (professer) => new UserDTO(professer)
      );
      return new CourseDTO(course);
    });

    res.send({ courses: coursesData });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get('/courses/stats', async (req, res, next) => {
  try {
    const stats = await CourseService.getStatistic(req.user._id);
    res.send({ stats });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get('/courses/:courseId', async (req, res, next) => {
  try {
    const course = await CourseService.getById(req.params.courseId);

    const courseData = {
      ...course,
      image: course.image
        ? `${process.env.BACKEND_URL}/attachments/${course.image}`
        : '',
      owner: new UserDTO(course.owner),
      professers: course.professers.map((p) => new UserDTO(p))
    };
    res.send({ course: courseData });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.put(
  '/courses/:courseId',
  uploadImage('./attachments', 'image').uploadUserImage(),
  async (req, res, next) => {
    try {
      const updatedCourse = await CourseService.updateById(
        req.body,
        req.params.courseId,
        req.file
      );
      res.send({ course: updatedCourse });
    } catch (error) {
      console.log(error);
      next(new ErrorHanlder('Sonething went wrong', 500));
    }
  }
);

router.post(
  '/courses',
  uploadImage('./attachments', 'image').uploadUserImage(),
  CourseValidation.postRequestBody(),
  async (req, res, next) => {
    try {
      const course = await CourseService.create({
        ...req.body,
        date: JSON.parse(req.body.date),
        professers: JSON.parse(req.body.professers),
        owner: req.user._id,
        image: req.file.filename
      });
      res.send({ course });
    } catch (error) {
      console.log(error);
      next(new ErrorHanlder('Somthing went wrong', 400));
    }
  }
);

router.post(
  '/courses/:courseId/video',
  // CourseValidation.postRequestBodyVideoUpload(),
  async (req, res, next) => {
    const busboy = Busboy({ headers: req.headers });

    let body = { adder: req.user._id };
    let saveTo;

    busboy.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;

      const ext = mimeType.split('/')[1];
      const filenameUTF8 = Buffer.from(filename, 'latin1').toString('utf8');

      const newFileName = `${new Date().getTime()}.${ext}`;

      body.file = newFileName;
      body.filename = filenameUTF8;
      saveTo = path.join(__dirname, '/../videos/', newFileName);
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', async function () {
      let durationInHour;
      try {
        const durationInSecond = await videoDuration.getVideoDurationInSeconds(
          saveTo
        );

        durationInHour = (durationInSecond / 60 / 60).toPrecision(4);
      } catch (error) {
        console.log(error);
        return next(new ErrorHanlder(error.message, 400));
      }

      const videoAttachment = AttachmentServices.createAttachmentVideo({
        title: body.title,
        type: 'video',
        file: Buffer.from(body.file, 'utf8').toString(),
        adder: body.adder,
        duration: durationInHour,
        filename: body.filename
      });

      let lesson;

      if (!body.id) {
        try {
          lesson = CourseService.createLesson({
            name: body.name,
            adder: body.adder,
            courseRef: body.courseRef
          });
        } catch (error) {
          console.log(error);
          return next(new ErrorHanlder('Something went wrong', 500));
        }
      } else {
        try {
          lesson = CourseService.findLessonById(body.id);
        } catch (error) {
          console.log(error);
          return next(new ErrorHanlder('Something went wrong', 500));
        }
      }

      // update lessons

      try {
        let [lessonPromise, videoAttachmentPromise] = await Promise.all([
          lesson,
          videoAttachment
        ]);

        lessonPromise.attachments.push(videoAttachmentPromise._id);
        videoAttachmentPromise.ref = lessonPromise._id;

        await Promise.all([
          lessonPromise.save(),
          videoAttachmentPromise.save()
        ]);

        return res.status(200).send({ message: 'File uploaded successfully.' });
      } catch (error) {
        console.log(error);
        return next(new ErrorHanlder('Something went wrong', 500));
      }
    });

    busboy.on('error', (err) => {
      return next(new ErrorHanlder(err.message, 500));
    });

    busboy.on('field', (name, val, info) => {
      body[name] = val;
    });

    req.pipe(busboy);
  }
);

router.get('/courses/:courseId/assignments', async (req, res, next) => {
  try {
    const assignments = await CourseService.getAssignmentsBelongToCourse(
      req.params.courseId
    );
    res.send({ assignments });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});
router.get('/courses/assignments/:assignmentId', async (req, res, next) => {
  try {
    const assignment = await CourseService.getAssignmentById(
      req.params.assignmentId
    );
    res.send({ assignment });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.put(
  '/courses/assignments/:assignmentId',
  uploadImage('./assignments', 'file').uploadAssignments(),
  async (req, res, next) => {
    try {
      const assignment = await CourseService.updateAssignment(
        req.body,
        req.files,
        req.params.assignmentId
      );
      res.send({ assignment });
    } catch (error) {
      next(new ErrorHanlder('Something went wrong', 500));
    }
  }
);

router.delete(
  '/courses/assignments/:assignmentId/file',
  async (req, res, next) => {
    try {
      await CourseService.deleteAttachmentBelongToAssignment(
        req.body,
        req.params.assignmentId
      );
      res.send();
    } catch (error) {
      console.log(error);
      next(new ErrorHanlder('Something went wrong', 500));
    }
  }
);

router.delete('/courses/:courseId/assignments', async (req, res, next) => {
  try {
    await CourseService.deleteAssignments(req.body);
    res.send();
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.post(
  '/courses/:courseId/assignments',
  uploadImage('./assignments', 'file').uploadAssignments(),
  CourseValidation.postRequestBodyAssignment(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(new ValidationError(errors.array()));
      }

      const assignment = await CourseService.createAssignment(
        req.body,
        req.files,
        req.params.courseId
      );
      res.send({ assignment });
      res.send();
    } catch (error) {
      console.log(error);
      next(
        new ErrorHanlder('Something went wrong, Please try again later', 500)
      );
    }
  }
);

router.post(
  '/courses/:courseId/lessons',
  CourseValidation.postRequestBodyLesson(),
  async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return next(new ValidationError(error.array()));
    }

    try {
      const body = req.body;
      const lesson = await CourseService.createLesson(
        {
          name: body.name,
          purposes: body.purposes,
          duration: body.duration,
          adder: req.user._id,
          courseRef: req.params.courseId
        },
        req.params.courseId
      );

      res.send({ lesson });
    } catch (error) {
      return next(new ErrorHanlder('Something went wrong', 500));
    }
  }
);

router.get('/courses/:courseId/lessons', async (req, res, next) => {
  try {
    const { type } = req.query;
    let lessons = await CourseService.getLessonsBelongToCourse(
      req.params.courseId,
      type
    );

    res.send({ lessons: lessons });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get(
  '/courses/:courseId/lessons/:lessonId/video/:videoName',
  async (req, res, next) => {
    try {
      const videoPath = `videos/${req.params.videoName}`;

      const videoStat = await fs.statSync(videoPath);
      const fileSize = videoStat.size;
      const videoRange = req.headers.range;

      if (videoRange) {
        const parts = videoRange.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;

        const file = fs.createReadStream(videoPath, { start, end });

        const head = {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Content-Length': chunksize,
          'Accept-Ranges': 'bytes'
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);

        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      console.log(error);
      next(new ErrorHanlder('Something went wrong', 500));
    }
  }
);

router.delete('/courses/:courseId/lessons', async (req, res, next) => {
  try {
    await CourseService.deleteLessonsGroup(req.params.courseId, req.body);
    res.send({ message: 'successfully deleted' });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.put('/courses/:courseId/lessons', async (req, res, next) => {
  try {
    await CourseService.updateLesson(req.params.courseId, req.body);
    res.send();
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.delete('/courses/:courseId/attacments', async (req, res, next) => {
  try {
    await CourseService.deleteAttachment(req.body);

    res.send();
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.put('/courses/:courseId/attacments', async (req, res, next) => {
  try {
    await CourseService.updateAttachment(req.body);
    res.send();
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.get('/courses/lessons/:lessonId', async (req, res, next) => {
  try {
    const lesson = await CourseService.getLessonById(req.params.lessonId);
    res.send({ lesson });
  } catch (error) {
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

router.put(
  '/courses/lessons/:lessonId',
  CourseValidation.putRequstBodyLesson(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    try {
      let query = {
        _id: req.body._id,
        name: req.body.name,
        duration: req.body.duration,
        purposes: req.body.purposes
      };
      const updatedLesson = await CourseService.updateLesson(
        req.params.lessonId,
        query
      );
      res.send({ lesson: updatedLesson });
    } catch (error) {
      console.log(error);
      next(new ErrorHanlder('Something went wrong', 500));
    }
  }
);

module.exports = router;
