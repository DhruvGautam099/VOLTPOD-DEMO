import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Zap, Map as MapIcon, Users, BarChart, LogOut, LayoutDashboard, Sparkles, Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        isActive 
          ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
      {label}
    </Link>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // ANTI-CRASH FIX 1: Safely default to an empty object if the user is logged out
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const { isDark, toggleTheme } = useTheme();

  // ANTI-CRASH FIX 2: Strictly format the wallet as a Number so .toFixed() never crashes
  const [wallet, setWallet] = useState(Number(user?.walletBalance) || 0);

  useEffect(() => {
    const handleWalletUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      if (updatedUser) setWallet(Number(updatedUser.walletBalance) || 0);
    };
    window.addEventListener('walletUpdated', handleWalletUpdate);
    return () => window.removeEventListener('walletUpdated', handleWalletUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#f8fafc] dark:bg-[#161b33] border-r border-gray-200 dark:border-gray-800 h-full flex-col justify-between hidden md:flex shrink-0 transition-colors duration-300">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VoltPod</span>
        </Link>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-500 mb-4 px-2 tracking-widest uppercase">Core Features</p>
          <NavItem to="/map" icon={MapIcon} label="Find & Book" />
          {token && <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />}
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800/50">
            <p className="text-[10px] font-bold text-gray-500 mb-4 px-2 tracking-widest uppercase">Account</p>
            {/* ADDED: The Missing Wallet Navigation Link */}
            {token && <NavItem to="/wallet" icon={Wallet} label="My Wallet" />}
            {user?.role === 'operator' && <NavItem to="/operator" icon={BarChart} label="Revenue" />}
            {user?.role === 'admin' && <NavItem to="/admin" icon={Users} label="Admin Panel" />}
            <NavItem to="/ai" icon={Sparkles} label="AI Assistant" />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-800/50">
        {token ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden pr-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                    <Wallet className="w-3 h-3" /> ₹{wallet.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors p-1">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors p-1">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
              <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-400 hover:text-yellow-600 transition-colors py-2 mb-4 border border-gray-300 dark:border-gray-800 rounded-xl">
              {isDark ? <><Sun className="w-4 h-4"/> Light Mode</> : <><Moon className="w-4 h-4"/> Dark Mode</>}
            </button>
              <Link to="/login" className="block text-center text-gray-600 dark:text-gray-300 font-semibold py-2">Login</Link>
            <Link to="/register" className="block text-center bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;