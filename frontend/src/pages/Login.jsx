import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-[#111827] p-8 md:p-12 rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#0a0f1a] rounded-2xl border border-[#00ff88]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            <Zap className="w-8 h-8 text-[#00ff88]" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold font-['Orbitron'] text-center text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Enter your details to access your account.</p>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-6 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0f1a] font-bold py-4 rounded-xl text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex justify-center items-center mt-4"
          >
            {loading ? <div className="w-6 h-6 border-2 border-[#0a0f1a] border-t-transparent rounded-full animate-spin"></div> : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Don't have an account? <Link to="/register" className="text-[#00ff88] font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
