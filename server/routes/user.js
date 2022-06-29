const router = require('express').Router();
const { validationResult, check } = require('express-validator');

// Services
const UserDTO = require('../dtos/user-dto');
const ErrorHanlder = require('../errors/ErrorHanlder');
const User = require('../services/user');
const FileServices = require('../services/file');

// Middleware
const AuthorizatioMiddleware = require('../middleware/auth');
const UserValidation = require('../middleware/validation/User');
const uploadMiddleware = require('../middleware/upload');

// Error Handler
const ValidationError = require('../errors/ValidationError');

// Require Authentication routes

router.use(AuthorizatioMiddleware.accessTokenAuthentication);

router.get('/users/role', async (req, res) => {
  const { role } = req.query;

  let users;

  if (role) {
    users = await User.findUsers({ role: role, _id: { $ne: req.user._id } });
  } else {
    users = await User.findUsers({ _id: { $ne: req.user._id } });
  }

  const userData = users.map((user) => new UserDTO(user));

  res.send({ users: userData });
});

router.get('/users/:id', async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(new ErrorHanlder('Access denied', 403));
  }

  const user = await User.findUser({ _id: req.params.id });

  const userDto = new UserDTO(user);

  res.send({ user: userDto });
});

router.put(
  '/users/image',
  uploadMiddleware('uploads', 'image').uploadUserImage(),
  async (req, res, next) => {
    try {
      const updatedUser = await FileServices.updateUserAttactment(
        {
          image: req.file.filename
        },
        req.user.id
      );

      const userDto = new UserDTO(updatedUser);

      res.send({ user: userDto });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

router.put(
  '/users/:id',
  UserValidation.validateBodyPutRequestChain(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }
    if (req.user.id.toString() !== req.params.id) {
      return next(new ErrorHanlder('Access denied', 403));
    }

    const user = await User.update(req.body, req.params.id);

    const userDto = new UserDTO(user);

    res.json({ user: userDto });
  }
);

module.exports = router;
