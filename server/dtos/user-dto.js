class UserDTO {
  id;
  username;
  subject;
  email;
  role;
  code;
  image;

  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.subject = user.subject;
    this.role = user.role;
    this.code = user.code;
    this.image = user.image
      ? `${process.env.BACKEND_URL}/user/${user.image}`
      : `${process.env.BACKEND_URL}/profile/noImg.png`;
  }
}

module.exports = UserDTO;
