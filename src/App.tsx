
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Profile from "./pages/Profile";
import SubjectPage from "./components/SubjectPage";
import SlideshowCanvas from "./components/SlideshowCanvas";
import StudentManagement from "./pages/StudentManagement";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import SchoolManagement from "./pages/admin/SchoolManagement";
import ClassProgression from "./pages/admin/ClassProgression";
import TeacherPortal from "./pages/admin/TeacherPortal";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin Portal Routes */}
              <Route path="/admin-portal/login" element={<AdminLogin />} />
              
              {/* Admin Protected Routes */}
              <Route element={<PrivateRoute roles={["admin", "headmaster", "teacher"]} redirectTo="/admin-portal/login" />}>
                <Route path="/admin-portal" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="teachers" element={<TeacherManagement />} />
                  <Route path="schools" element={<SchoolManagement />} />
                  <Route path="classes" element={<ClassProgression />} />
                  <Route path="teacher-portal" element={<TeacherPortal />} />
                </Route>
              </Route>
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subject/:subjectId" element={<SubjectPage />} />
                <Route path="/subject/:subjectId/slideshow/:chapterId" element={<SlideshowCanvas />} />
              </Route>
              
              {/* Routes for teachers and headmasters */}
              <Route element={<PrivateRoute roles={["teacher", "headmaster"]} />}>
                <Route path="/students" element={<StudentManagement />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
