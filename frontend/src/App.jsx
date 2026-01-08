import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage/Home'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import VerifyEmail from './pages/Auth/VerifyEmail'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'sonner'
import Navbar from './components/main-components/Navbar'
import ProfilePage from './pages/Profile/ProfilePage'
import ScrollToTop from './components/main-components/ScrollToTop'

// Course Pages
import AllCoursesPage from './pages/Courses/AllCoursesPage'
import SingleCoursePage from './pages/Courses/SingleCoursePage'
import LecturesPage from './pages/Courses/LecturesPage'
import TeacherDashboard from './pages/Dashboard/Teacher/TeacherDashboard'
import CreateCoursePage from './pages/Dashboard/Teacher/CreateCoursePage'
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard'
import ParentDashboard from './pages/Dashboard/Parents/ParentDashboard'
import StudentDashboard from './pages/Dashboard/Student/StudentDashboard'


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <Loader className="size-10 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen ">
        <Routes>
          <Route path="/" element={
            authUser 
              ? (authUser.isVerified ? <Home /> : <Navigate to="/verify-email" />) 
              : <Navigate to="/login" />
          } />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={
            authUser 
              ? (authUser.isVerified ? <Navigate to="/" /> : <VerifyEmail />) 
              : <Navigate to="/login" />
          } />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

          {/* Course Routes */}
          <Route path="/courses" element={authUser ? <AllCoursesPage /> : <Navigate to="/login" />} />
          <Route path="/course/:id" element={authUser ? <SingleCoursePage /> : <Navigate to="/login" />} />
          <Route path="/course/:id/lectures" element={authUser ? <LecturesPage /> : <Navigate to="/login" />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            authUser && (authUser.role === 'teacher' || authUser.role === 'admin') 
              ? <TeacherDashboard /> 
              : <Navigate to="/" />
          } />
          <Route path="/teacher/courses/create" element={
            authUser && (authUser.role === 'teacher' || authUser.role === 'admin') 
              ? <CreateCoursePage /> 
              : <Navigate to="/" />
          } />
          <Route path="/teacher/courses/edit/:id" element={
            authUser && (authUser.role === 'teacher' || authUser.role === 'admin') 
              ? <CreateCoursePage /> 
              : <Navigate to="/" />
          } />

           {/* Admin Routes */}
           <Route path="/admin/dashboard" element={
            authUser && authUser.role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/" />
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            authUser && (authUser.role === 'student' || authUser.role === 'admin') 
              ? <StudentDashboard /> 
              : <Navigate to="/" />
          } />

           {/* Parent Routes */}
           <Route path="/parent/dashboard" element={
            authUser && (authUser.role === 'parent' || authUser.role === 'admin') 
              ? <ParentDashboard /> 
              : <Navigate to="/" />
          } />
        </Routes>
      </main>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App