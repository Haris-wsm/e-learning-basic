import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

// students pages
import StudentHome from './pages/student/Home';
import StudentCourse from './pages/student/Course';
// Student Components
import SingleCourse from './pages/student/SingleCourse';
import StudentSetting from './pages/student/Setting';

// teacher pages
import TeacherHome from './pages/teacher/Home';
import SingleCourseTeacher from './pages/teacher/Course/SingleCourse';
import SingleCourseEdit from './pages/teacher/SingleCourseEdit';
import CourseTeacher from './pages/teacher/Course';
import TeacherSetting from './pages/teacher/Setting';
import TeacherNewCourse from './pages/teacher/CourseNew';
import AssignmentEdit from './pages/teacher/Course/Assignment';

import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// hooks
import useLoadingWithRefresh from './hook/useLoadingWithRefresh';
import LessonEdit from './pages/teacher/Course/LessonEdit';
import AssignmentTask from './pages/student/AssignmentTask';

function App() {
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <>Loading</>
  ) : (
    <>
      <BrowserRouter>
        <Routes>
          {/* student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRouteStudent>
                <StudentHome />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/student/course"
            element={
              <ProtectedRouteStudent>
                <StudentCourse />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/student/course/:id"
            element={
              <ProtectedRouteStudent>
                <SingleCourse />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/student/assignments/:id"
            element={
              <ProtectedRouteStudent>
                <AssignmentTask />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRouteStudent>
                <StudentSetting />
              </ProtectedRouteStudent>
            }
          />

          {/* teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRouteStudent>
                <TeacherHome />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/course"
            element={
              <ProtectedRouteStudent>
                <CourseTeacher />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/course/:id"
            element={
              <ProtectedRouteStudent>
                <SingleCourseTeacher />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/course/:id/edit"
            element={
              <ProtectedRouteStudent>
                <SingleCourseEdit />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/course/new"
            element={
              <ProtectedRouteStudent>
                <TeacherNewCourse />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/settings"
            element={
              <ProtectedRouteStudent>
                <TeacherSetting />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/assignment/:id/edit"
            element={
              <ProtectedRouteStudent>
                <AssignmentEdit />
              </ProtectedRouteStudent>
            }
          />
          <Route
            path="/teacher/lesson/:id/edit"
            element={
              <ProtectedRouteStudent>
                <LessonEdit />
              </ProtectedRouteStudent>
            }
          />
          {/* authentication rotes */}
          <Route path="/">
            <Route
              path="/"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </>
  );
}

const GuestRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);

  return !isAuth ? (
    children
  ) : isAuth && user.role === 'student' ? (
    <Navigate to={{ pathname: '/student' }} />
  ) : (
    <Navigate to={{ pathname: '/teacher' }} />
  );
};

const ProtectedRouteStudent = ({ children }) => {
  const location = useLocation();
  const { user, isAuth } = useSelector((state) => state.auth);

  return !isAuth ? (
    <Navigate to={{ pathname: '/', from: location }} />
  ) : isAuth && user.role ? (
    children
  ) : (
    <Navigate to={{ pathname: '/', from: location }} />
  );
};

const ProtectedRouteTeacher = ({ children }) => {
  const location = useLocation();
  const { user, isAuth } = useSelector((state) => state.auth);

  return !isAuth ? (
    <Navigate to={{ pathname: '/', from: location }} />
  ) : isAuth && user.role === 'student' ? (
    <Navigate to={{ pathname: '/student' }} />
  ) : (
    children
  );
};

export default App;
