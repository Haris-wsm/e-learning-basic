const UserDTO = require('../dtos/user-dto');
const AuthService = require('../services/auth');
const TokenService = require('../services/token');
const UserService = require('../services/user');
const ErrorHanlder = require('../errors/ErrorHanlder');

const router = require('express').Router();

const THIRTY_DAYS_IN_MILLIS = 1000 * 60 * 60 * 24 * 30;

router.get('/users', async (req, res, next) => {
  const user = await AuthService.findUser(req.query);

  if (user) return next(new ErrorHanlder('User already inuser', 400));
  res.json({ message: 'Valid for creation user' });
});

router.post('/login', async (req, res, next) => {
  const user = await AuthService.verify(req.body);

  if (!user)
    return next(new ErrorHanlder('Username or password not match', 400));

  const match = await AuthService.matchPassword(req.body, user.password);

  if (!match)
    return next(new ErrorHanlder('Username or password not match', 400));

  const { accessToken, refreshToken } = TokenService.generateToken({
    _id: user._id
  });

  await TokenService.storeRefreshToken(user._id, refreshToken);

  res.cookie('accessToken', accessToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });

  const userDto = new UserDTO(user);
  res.json({ user: userDto, auth: true });
});

router.post('/signup', async (req, res) => {
  const user = await AuthService.register(req.body);

  const { accessToken, refreshToken } = TokenService.generateToken({
    _id: user._id
  });

  await TokenService.storeRefreshToken(user._id, refreshToken);

  res.cookie('accessToken', accessToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });

  const userDto = new UserDTO(user);
  res.json({ user: userDto, auth: true });
});

router.get('/refresh', async (req, res, next) => {
  const { refreshToken: refreshTokenFromCookie } = req.cookies;

  let userData;

  try {
    userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie);
  } catch (error) {
    return next(new ErrorHanlder('Invalid Token!', 401));
  }

  try {
    const token = await TokenService.findRefreshToken(
      userData._id,
      refreshTokenFromCookie
    );

    if (!token) return next(new ErrorHanlder('Invalid Token', 401));
  } catch (error) {
    console.log(error);
    return next(new ErrorHanlder('Internal Error', 500));
  }

  // check if valid user

  const user = await UserService.findUser({ _id: userData._id });

  if (!user) return next(new ErrorHanlder('User not found', 404));

  // generate token

  const { accessToken, refreshToken } = await TokenService.generateToken({
    _id: userData._id
  });

  // update refresh token
  try {
    await TokenService.updateRefreshToken(userData._id, refreshToken);
  } catch (error) {
    return next(new ErrorHanlder('Internal Error', 500));
  }

  // put in cookie

  res.cookie('refreshToken', refreshToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });
  res.cookie('accessToken', accessToken, {
    maxAge: THIRTY_DAYS_IN_MILLIS,
    httpOnly: true
  });

  const userDto = new UserDTO(user);

  res.json({ user: userDto });
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;
  // delete refresh token from db
  await TokenService.removeToken(refreshToken);
  // delete cookies
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.json({ user: null, auth: false });
});

module.exports = router;
