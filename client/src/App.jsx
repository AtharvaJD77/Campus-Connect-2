import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetail from './pages/EventDetail';
import ClubProfile from './pages/ClubProfile';
import ClubAbout from './pages/ClubAbout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* If already logged in, redirect away from login/register */}
          <Route path="/login" element={user ? (['SystemAdmin', 'Admin'].includes(user.role) ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
          <Route path="/register" element={user ? (['SystemAdmin', 'Admin'].includes(user.role) ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Register />} />

          {/* Protected Dashboard route - requires login */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin Panel - SystemAdmin only */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['SystemAdmin', 'Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Event Detail page */}
          <Route path="/events/:id" element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          } />

          {/* Club Profile Detail page */}
          <Route path="/clubs/:id" element={
            <ProtectedRoute>
              <ClubProfile />
            </ProtectedRoute>
          } />

          {/* Club About page */}
          <Route path="/clubs/:id/about" element={
            <ProtectedRoute>
              <ClubAbout />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
