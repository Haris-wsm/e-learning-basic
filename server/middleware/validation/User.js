const UserService = require('../../services/user');
const AuthService = require('../../services/auth');

const { check } = require('express-validator');
class UserValidation {
  validateBodyPutRequestChain() {
    return [
      check('username')
        .optional()
        .notEmpty()
        .withMessage('Username is Required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Username must be at least 6 characters'),
      check('code').optional().notEmpty().withMessage('Student ID is Required'),
      check('subject')
        .optional()
        .notEmpty()
        .withMessage('Student Subject is Required'),
      check('password')
        .optional()
        .notEmpty()
        .withMessage('Password is Required')
        .bail()
        .custom(async (password, { req }) => {
          const userInDB = await UserService.findUser({ _id: req.user.id });

          const match = await AuthService.matchPassword(
            { password },
            userInDB.password
          );

          if (!match) throw new Error('Wrong Credential');
        }),
      check('newpassword')
        .optional()
        .notEmpty()
        .withMessage('New Password Confirm is Required')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Password must be at leat 8 characters'),
      check('consfirmPassword')
        .optional()
        .notEmpty()
        .withMessage('Password Confirm is Required')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Password must be at leat 8 characters')
        .bail()
        .custom((consfirmPassword, { req }) => {
          const { newpassword } = req.body;

          // console.log(consfirmPassword);
          // console.log(newpassword);

          if (consfirmPassword !== newpassword)
            throw new Error('Password must match');

          return true;
        })
    ];
  }
}
module.exports = new UserValidation();
