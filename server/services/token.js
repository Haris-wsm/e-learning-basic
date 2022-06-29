const jwt = require('jsonwebtoken');
const refreshModel = require('../model/RefreshToken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: '1y'
    });

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId, token) {
    try {
      await refreshModel.create({ token, userId });
    } catch (error) {
      console.log(error.message);
    }
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, refreshTokenSecret);
  }

  async findRefreshToken(userId, token) {
    return await refreshModel.findOne({ userId, token });
  }

  async updateRefreshToken(userId, token) {
    await refreshModel.updateOne({ userId }, { token });
  }
  async removeToken(token) {
    return await refreshModel.deleteOne({ token });
  }
}

module.exports = new TokenService();
