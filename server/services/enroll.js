const couresModel = require('../model/Course/Course');
const assignmentModel = require('../model/Course/Assignment');
const enrollModel = require('../model/Enroll');
const ObjectId = require('mongoose').Types.ObjectId;

class EnrollService {
  async getCourses(type, user) {
    let courses;

    if (type === 'me') {
      const enroll = await enrollModel.findOne({ userRef: user._id });

      if (!enroll) {
        courses = await enrollModel.create({ userRef: user._id });
        return courses;
      }

      courses = await enrollModel.aggregate([
        { $match: { userRef: ObjectId(user._id) } },
        { $unwind: '$courseRef' },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseRef',
            foreignField: '_id',
            pipeline: [
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
                  from: 'user',
                  localField: 'owner',
                  foreignField: '_id',
                  as: 'owner'
                }
              },
              { $unwind: { path: '$owner' } }
            ],
            as: 'courseRef'
          }
        },
        { $project: { courseRef: 1, _id: 0 } },
        { $unwind: '$courseRef' },
        { $replaceRoot: { newRoot: '$courseRef' } }
      ]);
    } else {
      const myEnroll = await enrollModel.findOne({ userRef: user._id });
      const filterQuery = myEnroll.courseRef || [];

      courses = await couresModel.aggregate([
        { $match: { _id: { $nin: filterQuery } } },
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

    return courses;
  }

  async getAssignmentsById(id) {
    return await assignmentModel.findById(id);
  }

  async createEnroll(body, user) {
    const userEnroll = await enrollModel.findOne({ userRef: user._id });

    if (userEnroll) {
      await enrollModel.updateOne(
        { userRef: user._id },
        { $push: { courseRef: body.courseRef } }
      );

      return;
    }
    await enrollModel.create({ ...body, userRef: user._id });
  }

  async getAssignments(userId) {
    const assignments = await enrollModel.aggregate([
      { $match: { userRef: userId } },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseRef',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'lessons',
                localField: 'lessons',
                foreignField: '_id',
                as: 'lessons'
              }
            },
            { $project: { lessons: 1 } }
          ],
          as: 'courseRef'
        }
      },
      {
        $unwind: { path: '$courseRef' }
      },
      { $project: { courseRef: 1 } },
      { $unwind: { path: '$courseRef.lessons' } },
      {
        $replaceRoot: { newRoot: '$courseRef.lessons' }
      },
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignments',
          foreignField: '_id',
          as: 'assignments'
        }
      },
      { $unwind: { path: '$assignments' } },
      { $replaceRoot: { newRoot: '$assignments' } },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseRef',
          foreignField: '_id',
          as: 'courseRef'
        }
      },
      { $unwind: { path: '$courseRef' } }
    ]);

    return assignments;
  }
}

module.exports = new EnrollService();
