const userModel = require('../model/User');
const path = require('path');
const ErrorHanlder = require('../errors/ErrorHanlder');
const fs = require('fs').promises;

const { PROFILE_DIR } = process.env;

// const userProfileDir = path.join('.', PROFILE_DIR);

class FileServices {
  async updateUserAttactment(body, id) {
    try {
      const user = await userModel.findOne({ _id: id });

      if (user.image) {
        const userProfilePath = path.join('.', PROFILE_DIR, user.image);

        // test exist path of user's image profile
        await fs.access(userProfilePath);
        await fs.unlink(userProfilePath);
      }
    } catch (error) {
      throw new ErrorHanlder('File does not exist', 400);
    }

    try {
      const updatedUser = await userModel.findByIdAndUpdate({ _id: id }, body, {
        new: true,
        runValidators: false
      });

      return updatedUser;
    } catch (error) {
      throw new ErrorHanlder('Somthing went wrong', 500);
    }
  }
}

module.exports = new FileServices();
