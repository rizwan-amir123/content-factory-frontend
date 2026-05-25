import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Layout Partials
import ProtectedLayout from './components/ProtectedLayout';

// View Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BatchDetail from './pages/BatchDetail';
import CreateContent from './pages/CreateContent';

export default function App() {
  const { accessToken } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Unauthenticated Gateway Routes */}
        <Route path="/login" element={!accessToken ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!accessToken ? <Register /> : <Navigate to="/dashboard" replace />} />

        {/* Nested Protected Layout Window Routing Wrapper */}
        <Route path="/" element={accessToken ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
          {/* Automatically injects dashboard into <Outlet /> if path matches base server index */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateContent />} />
          <Route path="batch/:id" element={<BatchDetail />} />
        </Route>

        {/* Global Structural Redirection Catchment */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
