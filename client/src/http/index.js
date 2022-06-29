import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export const login = (data) => api.post('/login', data);

export const signup = (data) => api.post('/signup', data);
export const refreshToken = () => api.get('/refresh');
export const findUser = (data) => api.get(`/users?username=${data.username}`);

export const logout = () => api.post('/logout');

// Users

export const getUsers = (options) =>
  api.get(`/users/role?${options && `role=${options.role}`}`);
export const updateUser = (data, id) => api.put(`/users/${id}`, data);
export const uploadImage = (formData) =>
  api.put('/users/image', formData, { headers: 'multipart/form-data' });

// Course

export const getAllCourse = () => api.get('/courses');

export const getCourseById = (courseId) => api.get(`/courses/${courseId}`);
export const createCourse = (data) =>
  api.post('/courses', data, { headers: 'multipart/form-data' });

export const createLesson = (data, id) =>
  api.post(`/courses/${id}/lessons`, data);

export const getLessonBelongToCourse = (id, type) =>
  api.get(`/courses/${id}/lessons?type=${type}`);

export const getCourse = (id) => api.get(`/courses/${id}`);

export const updateCourse = (data, id) => api.put(`/courses/${id}`, data);

export const uploadVideo = (id, data, cb) =>
  api.post(`/courses/${id}/video`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    },
    onUploadProgress: function (progressEvent) {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded * 100) / total);
      cb(percentage);
    }
  });

export const getStat = () => api.get(`/courses/stats`);

// Lessons

export const getLessonById = (lessonId) =>
  api.get(`/courses/lessons/${lessonId}`);

export const deleteLessonsBelongToCourse = (courseId, body) =>
  api.delete(`/courses/${courseId}/lessons`, { data: { ...body } });

export const updateLessonById = (lessonId, body) =>
  api.put(`/courses/lessons/${lessonId}`, body);

export const updateLesson = (courseId, body) =>
  api.put(`/courses/${courseId}/lessons`, body);

// Attachments
export const deleteAttaments = (body, courseId) =>
  api.delete(`/courses/${courseId}/attacments`, { data: { ...body } });

export const updateAttachment = (body, courseId) =>
  api.put(`/courses/${courseId}/attacments`, body);

// Assignment

export const getAssignment = (assignmentId) =>
  api.get(`/courses/assignments/${assignmentId}`);

export const getAssignmentsBelongToCourse = (courseId) =>
  api.get(`/courses/${courseId}/assignments`);

export const createAssignment = (body, courseId) =>
  api.post(`/courses/${courseId}/assignments`, body, {
    headers: { 'content-type': 'multipart/form-data' }
  });

export const updateAssignment = (body, assignmentId) =>
  api.put(`/courses/assignments/${assignmentId}`, body);

export const deleteAssignments = (body, courseId) =>
  api.delete(`/courses/${courseId}/assignments`, { data: { ...body } });

export const deleteAssignment = (body, assignmentId) =>
  api.delete(`/courses/assignments/${assignmentId}/file`, {
    data: { ...body }
  });

// Enroll

export const getCourseByFilter = (filter) =>
  api.get(`/enroll/courses?type=${filter}`);

export const enrollCourse = (body) => api.post(`/enroll/courses`, body);

export const getEnrollCourseAssignments = () => api.get('/enroll/assignments');

export const getAssignmentById = (id) => api.get(`/enroll/assignments/${id}`);

// File

export const downLoadFile = (filename) =>
  api.get(`/file/download/${filename}`, { responseType: 'blob' });

// Interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/refresh`, {
          withCredentials: true
        });

        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);
