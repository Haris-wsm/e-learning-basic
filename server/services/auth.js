const User = require('../model/User');
const bcrypt = require('bcrypt');

class AuthService {
  async register(body) {
    const hashPassword = await bcrypt.hash(body.password, 10);
    body = { ...body, password: hashPassword };
    const user = await User.create(body);
    return user;
  }

  async verify(body) {
    const { username, role } = body;

    const user = await User.findOne({ username, role });

    return user;
  }

  async matchPassword(body, hash) {
    return await bcrypt.compare(body.password, hash);
  }

  async findUser(body) {
    const { username } = body;

    const user = await User.findOne({ username });
    return user;
  }
}

module.exports = new AuthService();
