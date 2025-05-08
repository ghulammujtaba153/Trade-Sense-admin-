import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layouts/DashboardLayout';
import Users from './pages/Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Courses from './pages/Courses';
import Plans from './pages/Plans';
import Editors from './pages/Editors';
import MindFulResources from './pages/MindFulResources';
import InstructorManagement from './pages/InstructorManagement';
import Admins from './pages/Admins';
import OnboardingQuestionnaire from './pages/OnboardingQuestionnaire';
import PillarsCategories from './pages/PillarsCategories';
import AccountabilityManagement from './pages/AccountabilityManagement';
import Notification from './pages/Notification';
import TagsManagement from './pages/TagsManagement';
import ContentManagement from './pages/ContentManagement';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/courses" >
                <Route index element={<Courses />} />
                <Route path="instructors" element={<InstructorManagement/>} />
              </Route>
              <Route path='/plans' element={<Plans/>} />
              <Route path='/editors' element={<Editors/>} />

              <Route path="/resources" element={<MindFulResources />}/>
              <Route path='/pillars/categories' element={<PillarsCategories/>} />
              <Route path='/tags' element={<TagsManagement/>} />
              <Route path='/content' element={<ContentManagement/>} />

              <Route path='/accountability' element={<AccountabilityManagement/>} />

              <Route path='/onboarding' element={<OnboardingQuestionnaire/>} />
              <Route path="/notifications" element={<Notification/>}/>
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      
     
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;