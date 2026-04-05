import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import HomePage from "../components/home/Home";

// Dashboards
import UserDashboard from "../components/dashbord/UserDashboard";
import VerifierDashboard from "../components/dashbord/VerifierDashboard";
import ApproverDashboard from "../components/dashbord/ApproverDashboard";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'user': return <Navigate to="/user/dashboard" />;
      case 'verifier': return <Navigate to="/verifier/dashboard" />;
      case 'approver': return <Navigate to="/approver/dashboard" />;
      default: return <Navigate to="/login" />;
    }
  }
  
  return children;
};

// Role-Based Dashboard Component
const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Return dashboard based on role
  switch (user.role) {
    case 'user':
      return <UserDashboard />;
    case 'verifier':
      return <VerifierDashboard />;
    case 'approver':
      return <ApproverDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <Layout>
            <HomePage />
          </Layout>
        } 
      />
      <Route 
        path="/login" 
        element={
          <Layout>
            <Login />
          </Layout>
        } 
      />
      <Route 
        path="/register" 
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      
      {/* Role-Based Dashboard Routes - Direct Access */}
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verifier/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['verifier']}>
            <VerifierDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/approver/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['approver']}>
            <ApproverDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Generic Dashboard Route - Redirects based on role */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user', 'verifier', 'approver']}>
            <RoleBasedDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback - Redirect to home if route not found */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;




