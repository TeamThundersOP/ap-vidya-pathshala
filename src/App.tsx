
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Subjects from "./pages/Subjects";
import SubjectPage from "./components/SubjectPage";
import FractionsChapter from "./pages/FractionsChapter";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import StudentManagement from "./pages/StudentManagement";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import SchoolManagement from "./pages/admin/SchoolManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import ClassProgression from "./pages/admin/ClassProgression";
import TeacherPortal from "./pages/admin/TeacherPortal";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/chapter/grade/:gradeId/fractions" element={<FractionsChapter />} />
            <Route path="/student-management" element={<StudentManagement />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-portal" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="schools" element={<SchoolManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="class-progression" element={<ClassProgression />} />
            <Route path="teacher-portal" element={<TeacherPortal />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
