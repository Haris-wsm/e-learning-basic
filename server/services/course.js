const couresModel = require('../model/Course/Course');
const ObjectId = require('mongoose').Types.ObjectId;
const lessonModel = require('../model/Course/Lesson');
const attachmentModel = require('../model/Course/Attachments');
const assignmentModel = require('../model/Course/Assignment');
const enrollModel = require('../model/Enroll');

const AttachmentServices = require('../services/attachments');
const path = require('path');
const fs = require('fs');

class CourseService {
  async create(body) {
    return await couresModel.create(body);
  }

  async getAll(query) {
    return await couresModel.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'user',
          localField: 'owner',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0 } }],
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner'
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'professers',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0 } }],
          as: 'professers'
        }
      }
    ]);
  }

  async updateById(body, id, file) {
    let query = {
      name: body.name,
      desc: body.desc,
      professers: JSON.parse(body.professers),
      date: JSON.parse(body.date).map((d) => {
        delete d._id;
        return d;
      })
    };

    if (file) {
      query.filename = file.filename;
      query.image = file.filename;
    }
    const updatedCourse = await couresModel.findByIdAndUpdate(id, query, {
      new: true
    });
    // const updatedCourse = await couresModel.aggregate([
    //   { $match: { _id: ObjectId(id) } },
    //   { $set: body }
    // ]);

    return updatedCourse;
  }

  async getLesson(body) {
    return await lessonModel.findOne(body);
  }

  async getById(id) {
    const course = await couresModel.aggregate([
      {
        $match: {
          _id: ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: { path: '$owner' } },
      {
        $lookup: {
          from: 'user',
          localField: 'professers',
          foreignField: '_id',
          as: 'professers'
        }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessons',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'attachments',
                localField: 'attachments',
                foreignField: '_id',
                as: 'attachments'
              }
            },
            {
              $lookup: {
                from: 'assignments',
                localField: 'assignments',
                foreignField: '_id',
                pipeline: [{ $sort: { createdAt: -1 } }],
                as: 'assignments'
              }
            }
          ],
          as: 'lessons'
        }
      }
    ]);
    return course[0];
  }

  async getLessonsBelongToCourse(courseId, type) {
    let lessons;

    if (type === 'video') {
      lessons = await lessonModel.aggregate([
        { $match: { courseRef: ObjectId(courseId) } },
        {
          $project: {
            _id: 0,
            attachments: 1
          }
        },

        {
          $lookup: {
            from: 'attachments',
            localField: 'attachments',
            foreignField: '_id',
            pipeline: [
              {
                $addFields: { id: '$_id' }
              },
              {
                $lookup: {
                  from: 'user',
                  localField: 'adder',
                  foreignField: '_id',
                  as: 'adder'
                }
              },
              { $unwind: { path: '$adder' } },
              { $addFields: { adder: '$adder.username' } },
              {
                $lookup: {
                  from: 'lessons',
                  localField: 'ref',
                  foreignField: '_id',
                  as: 'lesson'
                }
              },
              { $unwind: { path: '$lesson' } }
              // { $project: { '$ref._id': 1, '$ref.name': 1 } }
            ],
            as: 'attachments'
          }
        },
        { $unwind: { path: '$attachments' } },

        { $replaceRoot: { newRoot: '$attachments' } }
      ]);
    } else if (type === 'lesson') {
      lessons = await lessonModel.aggregate([
        { $match: { courseRef: ObjectId(courseId) } },
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'adder',
            as: 'adder'
          }
        },
        {
          $unwind: {
            path: '$adder'
          }
        },
        { $addFields: { adder: '$adder.username', id: '$_id' } }
        // { $project: { _id: 1, label: '$name' } }
      ]);
    } else {
      lessons = await lessonModel.aggregate([
        { $match: { courseRef: ObjectId(courseId) } },
        { $project: { _id: 1, label: '$name' } }
      ]);
    }

    return lessons;
  }

  async createLesson(body, courseId) {
    const lesson = await lessonModel.create(body);
    await couresModel.findByIdAndUpdate(courseId, {
      $push: { lessons: [lesson._id] }
    });
    return lesson;
  }

  async findLessonById(id) {
    const lesson = await lessonModel.findById(id);

    return lesson;
  }

  async deleteLessonsGroup(courseId, body) {
    const lessons = await lessonModel.find({ _id: { $in: body.ids } });
    for (const lesson of lessons) {
      if (lesson.attachments.length)
        await this.deleteAttachment({ ids: lesson.attachments });
      await lesson.delete();
    }

    const assigments = await assignmentModel.find({ ref: { $in: body.ids } });
    for (const assignment of assigments) {
      await this.deleteAssignment(assignment.attachments);
      await assignment.delete();
    }

    await couresModel.findByIdAndUpdate(courseId, {
      $pull: { lessons: { $in: body.ids } }
    });
  }

  async deleteAssignment(attachments) {
    const assignmentDir = path.join('.', process.env.ASSIGNMENT_DIR);

    let filePath;

    for (const attachment of attachments) {
      filePath = path.resolve('.', assignmentDir, attachment);
      await fs.promises.unlink(filePath);
    }
  }

  async updateLesson(courseId, body) {
    const query = { ...body };
    delete query._id;

    await lessonModel.findByIdAndUpdate(body._id, query);
  }

  async deleteAttachment(body) {
    const attachmentPath = path.join('.', process.env.VIDEO_DIR);

    const attachments = await attachmentModel.find({
      _id: { $in: body.ids }
    });

    await AttachmentServices.removeFiles(attachments, attachmentPath);

    return attachments;
  }

  async updateAttachment(body) {
    const query = { ...body };
    delete query._id;
    await attachmentModel.findByIdAndUpdate(body._id, query);
  }

  async createAssignment(body, files, courseId) {
    if (files.length > 0) {
      body.attachments = files.map((file) => file.filename);
    }

    body.courseRef = courseId;

    const assignment = await assignmentModel.create(body);
    const lesson = await lessonModel.findById(assignment.ref);
    lesson.assignments.push(assignment._id);
    await lesson.save();

    return assignment;
  }

  async getAssignmentsBelongToCourse(courseId) {
    return await assignmentModel.find({ courseRef: courseId });
  }

  async deleteAssignments(body) {
    const assignments = await assignmentModel.find({ _id: { $in: body.ids } });

    const attachmentDir = path.join('.', 'assignments');

    for (const assignment of assignments) {
      if (assignment.attachments.length > 0) {
        await AttachmentServices.removeFileAssignments(
          assignment.attachments,
          attachmentDir
        );
      }
      await assignment.delete();
    }
  }

  async getAssignmentById(assignmentId) {
    return await assignmentModel.findById(assignmentId);
  }

  async updateAssignment(body, files, assignmentId) {
    let query = { ...body };

    if (files) {
      query['$push'] = { attachments: files.map((file) => file.filename) };
    }

    const assignment = await assignmentModel.findByIdAndUpdate(
      assignmentId,
      query
    );

    return assignment;
  }

  async deleteAttachmentBelongToAssignment(body, assignmentId) {
    const assignment = await assignmentModel.findById(assignmentId);

    const filenameToDelete = body.file;
    const filePath = path.join('.', process.env.ASSIGNMENT_DIR);

    await AttachmentServices.deleteSingleFile(body.file, filePath);
    assignment.attachments = assignment.attachments.filter(
      (filename) => filename !== filenameToDelete
    );
    await assignment.save();
  }

  async getLessonById(lessonId) {
    return await lessonModel.findById(lessonId);
  }

  async getStatistic(userId) {
    const statsPromise = couresModel.aggregate([
      {
        $match: {
          owner: userId
        }
      },
      {
        $group: { _id: null, course: { $count: {} } }
      },
      { $project: { _id: 0, course: 1 } }
    ]);

    const assignmentsPromise = assignmentModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseRef',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'user',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
              }
            }
          ],
          as: 'courseRef'
        }
      },
      { $match: { 'courseRef.owner._id': userId } },
      { $group: { _id: null, assignments: { $count: {} } } },
      { $project: { _id: 0, assignments: 1 } }
    ]);

    const enrollStuentPromise = enrollModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseRef',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'user',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
              }
            }
          ],
          as: 'courseRef'
        }
      },
      { $match: { 'courseRef.owner._id': userId } },
      { $group: { _id: null, students: { $count: {} } } },
      { $project: { _id: 0, students: 1 } }
    ]);

    const [stats, assignments, enrollStuent] = await Promise.all([
      statsPromise,
      assignmentsPromise,
      enrollStuentPromise
    ]);

    return { ...stats[0], ...assignments[0], ...enrollStuent[0] };
  }
}

module.exports = new CourseService();
