import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import AiChat from './pages/AiChat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Podcast from './pages/Podcast';
import PodcastDetail from './pages/PodcastDetail';
import Document from './pages/Document';
import Achievements from './pages/achievements'; // Corrected import
import { setupFirestore } from './utils/firestoreSetup';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import CourseDetail from './pages/coursesdetail'; // Corrected import
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import Komunitas from './pages/Komunitas';
import GroupRoom from './components/chat/GroupRoom';
import ChatPage from './pages/ChatPage';
import EventPage from './pages/Event';
import CommunityPage from './pages/CommunityPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import Beasiswa from './pages/Beasiswa';
import { initializeScholarships } from './utils/initScholarships';

function AppContent() {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser?.uid) {
      setupFirestore(currentUser.uid);
      initializeScholarships();
    }
  }, [currentUser]);

  // Update noNavbarPaths to include achievements
  const noNavbarPaths = [
    '/profile', 
    '/courses', 
    '/podcast', 
    '/document', 
    '/achievements',
    '/beasiswa'  // Add this path
  ];
  const showNavbar = !(
    noNavbarPaths.includes(location.pathname) || 
    location.pathname.startsWith('/podcast/') ||
    location.pathname.startsWith('/course/') ||
    location.pathname.startsWith('/quiz/')
  );

  // Update sidebarPages to include achievements
  const sidebarPages = [
    '/profile', 
    '/courses', 
    '/podcast', 
    '/podcast/:id', 
    '/document',
    '/course/:id',
    '/quiz/:courseId',
    '/achievements',
    '/beasiswa'
  ];
  
  const showSidebar = sidebarPages.some(page => 
    location.pathname === page || 
    (page.includes(':') && location.pathname.startsWith(page.split(':')[0]))
  );

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/ai-chat" element={<AiChat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/document" element={
          <ProtectedRoute>
            <Document />
          </ProtectedRoute>
        }/>
        <Route path="/podcast/:id" element={
          <ProtectedRoute>
            <PodcastDetail />
          </ProtectedRoute>
        }/>
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/course/:id" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />
        <Route path="/quiz/:courseId" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Add the new Achievements route */}
        <Route path="/achievements" element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        } />
        <Route path="/komunitas" element={<Komunitas />} />
        <Route path="/group/:groupId" element={
          <ProtectedRoute>
            <GroupRoom />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/beasiswa" element={
          <ProtectedRoute>
            <Beasiswa />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

// Protected Route wrapper (unchanged)
function ProtectedRoute({ children }) {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9800]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;