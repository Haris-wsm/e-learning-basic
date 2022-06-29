const userModel = require('../model/User');
const bcrypt = require('bcrypt');

class UserService {
  async findUser(body) {
    return await userModel.findOne(body);
  }

  async findUsers(body) {
    return await userModel.find(body);
  }

  async update(body, id) {
    if (body.newpassword) {
      const hashPassword = await bcrypt.hash(body.password, 10);
      body = { ...body, password: hashPassword };
    }

    return await userModel.findByIdAndUpdate({ _id: id }, body, {
      new: true,
      runValidators: false
    });
  }
}
module.exports = new UserService();
