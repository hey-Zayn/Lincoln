import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import TeacherDashboardHome from './pages/Dashboard/Teacher/Pages/TeacherDashboardHome'
import CreateCoursePage from './pages/Dashboard/Teacher/Pages/CreateCoursePage'
import CreateCourseLectures from './pages/Dashboard/Teacher/Pages/CreateCourseLectures'
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard'
import AdminHome from './pages/Dashboard/Admin/Admin-Pages/AdminHome'
import AdminUserManagement from './pages/Dashboard/Admin/Admin-Pages/AdminUserManagement'
import AdminAddNewUser from './pages/Dashboard/Admin/Admin-Pages/AdminAddNewUser'
import ParentDashboard from './pages/Dashboard/Parents/ParentDashboard'
import ParentHome from './pages/Dashboard/Parents/pages/ParentDashboardHome'
import StudentDashboard from './pages/Dashboard/Student/StudentDashboard'
import StudentHome from './pages/Dashboard/Student/pages/StudentDashboardHome'
import ManagementDashboard from './pages/Dashboard/Management/ManagementDashboard'
import ManagementHome from './pages/Dashboard/Management/pages/ManagementHome'
import SettingPage from './pages/Settings/SettingPage'


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

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

  const isDashboardRoute = ['/admin', '/teacher', '/student', '/parent', '/management'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <main className="min-h-screen ">
        <Routes>
          <Route path="/" element={
            authUser
              ? (authUser.isVerified ? <Home /> : <Navigate to="/verify-email" />)
              : <Navigate to="/login" />
          } />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/setting" element={authUser ? <SettingPage /> : <Navigate to="/" />} />
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
          {/* Teacher Routes */}
          <Route path="/teacher" element={
            authUser && (authUser.role === 'teacher' || authUser.role === 'admin')
              ? <TeacherDashboard />
              : <Navigate to="/" />
          }>
            <Route path="dashboard" element={<TeacherDashboardHome />} />
            <Route path="courses" element={<div className="p-4 text-white">My Courses List (Coming Soon)</div>} />
            <Route path="courses/create" element={<CreateCoursePage />} />
            <Route path="courses/:id/edit" element={<CreateCoursePage />} />
            <Route path="courses/:id/curriculum" element={<CreateCourseLectures />} />
            <Route path="students" element={<div className="p-4 text-white">Students Directory (Coming Soon)</div>} />
            <Route path="assignments" element={<div className="p-4 text-white">Assignments Manager (Coming Soon)</div>} />
            <Route path="schedule" element={<div className="p-4 text-white">Class Schedule (Coming Soon)</div>} />
            <Route path="resources" element={<div className="p-4 text-white">Resource Library (Coming Soon)</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            authUser && authUser.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to="/" />
          }>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="users/add" element={<AdminAddNewUser />} />
            <Route path="courses" element={<div className="p-4 text-white">Course Registry (Coming Soon)</div>} />
            <Route path="analytics" element={<div className="p-4 text-white">System Analytics (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-4 text-white">System Settings (Coming Soon)</div>} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            authUser && (authUser.role === 'student' || authUser.role === 'admin')
              ? <StudentDashboard />
              : <Navigate to="/" />
          }>
            <Route path="dashboard" element={<StudentHome />} />
            <Route path="courses" element={<div className="p-4 text-white">My Courses (Coming Soon)</div>} />
            <Route path="assignments" element={<div className="p-4 text-white">Assignments (Coming Soon)</div>} />
            <Route path="results" element={<div className="p-4 text-white">Exams & Results (Coming Soon)</div>} />
            <Route path="library" element={<div className="p-4 text-white">Resource Library (Coming Soon)</div>} />
            <Route path="schedule" element={<div className="p-4 text-white">Class Schedule (Coming Soon)</div>} />
          </Route>

          {/* Management Routes */}
          <Route path="/management" element={
            authUser && (authUser.role === 'management' || authUser.role === 'admin')
              ? <ManagementDashboard />
              : <Navigate to="/" />
          }>
            <Route path="dashboard" element={<ManagementHome />} />
            <Route path="staff" element={<div className="p-4 text-white">Staff Directory (Coming Soon)</div>} />
            <Route path="finance" element={<div className="p-4 text-white">Financials (Coming Soon)</div>} />
            <Route path="reports" element={<div className="p-4 text-white">Performance Reports (Coming Soon)</div>} />
            <Route path="policies" element={<div className="p-4 text-white">Policy Center (Coming Soon)</div>} />
            <Route path="facilities" element={<div className="p-4 text-white">Campus Facility (Coming Soon)</div>} />
          </Route>

          {/* Parent Routes */}
          <Route path="/parent" element={
            authUser && (authUser.role === 'parent' || authUser.role === 'admin')
              ? <ParentDashboard />
              : <Navigate to="/" />
          }>
            <Route path="dashboard" element={<ParentHome />} />
            <Route path="progress" element={<div className="p-4 text-white">Progress Tracking (Coming Soon)</div>} />
            <Route path="fees" element={<div className="p-4 text-white">Fee Structure (Coming Soon)</div>} />
            <Route path="exams" element={<div className="p-4 text-white">Exams & Results (Coming Soon)</div>} />
            <Route path="messages" element={<div className="p-4 text-white">Communication (Coming Soon)</div>} />
          </Route>
        </Routes>
      </main>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App