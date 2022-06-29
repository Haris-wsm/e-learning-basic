import { uploadImage } from '../http';

class FileUpload {
  async uploadUserImage(file) {
    return await uploadImage(file);
  }
}

export default new FileUpload();
