const path = require('path');
const fs = require('fs');

const attachmentDir = path.resolve('.', 'attachments');
const assignmentsDir = path.resolve('.', 'assignments');
const videoDir = path.resolve('.', 'videos');

function isDirectoryExist(path) {
  return fs.existsSync(path);
}

if (!isDirectoryExist(attachmentDir)) {
  fs.mkdirSync(attachmentDir);
}
if (!isDirectoryExist(assignmentsDir)) {
  fs.mkdirSync(assignmentsDir);
}
if (!isDirectoryExist(videoDir)) {
  fs.mkdirSync(videoDir);
}
