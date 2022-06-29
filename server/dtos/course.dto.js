class CourseDTO {
  name;
  desc;
  image;
  owner;
  professers;
  date;
  assignments;
  lessons;
  _id;

  constructor(course) {
    this._id = course._id;
    this.name = course.name;
    this.desc = course.desc;
    this.image = course.image
      ? `${process.env.BACKEND_URL}/attachments/${course.image}`
      : `${process.env.BACKEND_URL}/profile/Course-bg.png`;

    this.owner = course.owner;
    this.professers = course.professers;
    this.date = course.date;
    this.assignments = course.assignments;
    this.lessons = course.lessons;
  }
}

module.exports = CourseDTO;
