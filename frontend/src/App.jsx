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
        <Loader className="size-10 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen ">
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
        </Routes>
      </main>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App