import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjetDetails from './pages/ProjetDetails';
import CreateProjet from './pages/CreateProjet';
import EditProjet from './pages/EditProjet';
import NotFound from './pages/NotFound';
import ProtectRoute from './components/ProtectRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  return (
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projet/:id" element={<ProtectRoute><ProjetDetails /></ProtectRoute>} />
              <Route path="/projet/:id/edit" element={<ProtectRoute><EditProjet backgroundLocation={backgroundLocation} /></ProtectRoute>} />
              <Route path="/projet/create" element={<ProtectRoute><CreateProjet /></ProtectRoute>} />
              <Route path="/admin" element={<ProtectRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectRoute>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>

    
  );
}

export default App;
