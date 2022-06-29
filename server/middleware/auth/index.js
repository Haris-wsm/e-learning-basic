const { check } = require('express-validator');

// Services
const UserDTO = require('../../dtos/user-dto');
const ErrorHandlder = require('../../errors/ErrorHanlder');
const TokenService = require('../../services/token');
const UserService = require('../../services/user');

class AuthorizatioMiddleware {
  async accessTokenAuthentication(req, res, next) {
    const { accessToken } = req.cookies;

    let userData;

    if (accessToken) {
      try {
        userData = await TokenService.verifyAccessToken(accessToken);
      } catch (error) {
        return next(new ErrorHandlder('Invalid token', 401));
      }
      const user = await UserService.findUser({ _id: userData._id });

      if (user) {
        req.user = user;
      }
    }

    next();
  }

  restrictByRole(roles) {
    return (req, res, next) => {
      const match = roles.includes(req.user.role);

      if (match) return next();

      return next(new ErrorHandlder('No permissions for this user.', 403));
    };
  }
}

module.exports = new AuthorizatioMiddleware();
