const attachModel = require('../model/Course/Attachments');
const fs = require('fs');
const path = require('path');

class AttachmentServices {
  async createAttachmentVideo(body) {
    const attachmnets = await attachModel.create(body);

    return attachmnets;
  }

  async removeFiles(attachments, dirPath) {
    let filePath;
    for (const attachment of attachments) {
      filePath = path.resolve('.', dirPath, attachment.file);

      try {
        await fs.promises.unlink(filePath);
        await attachment.delete();
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async removeFileAssignments(attachments, dirPath) {
    let filePath;
    for (const attachment of attachments) {
      filePath = path.resolve('.', dirPath, attachment);

      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async deleteSingleFile(filename, dirPath) {
    let filePath;

    try {
      filePath = path.resolve('.', dirPath, filename);
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = new AttachmentServices();
