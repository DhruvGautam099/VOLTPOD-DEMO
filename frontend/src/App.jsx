import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AIAssistant from './pages/AIAssistant';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import OperatorDashboard from './pages/OperatorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no preference is saved
    if (savedTheme === 'dark' || !savedTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-row h-screen bg-[#eef2f6] dark:bg-[#0a0f1a] font-sans text-gray-800 dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<Home />} />
            {/* Note: The duplicate /book route is removed */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/operator" element={<OperatorDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;