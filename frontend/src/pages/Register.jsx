import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Zap, User, Mail, Lock, Car, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    vehicleName: '',
    batteryCapacity: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        vehicle: {
          name: formData.vehicleName,
          batteryCapacity: Number(formData.batteryCapacity) || 0
        }
      };
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Smart Redirection based on role!
      if (res.data.user.role === 'operator') {
        navigate('/operator');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-slate-100 dark:bg-[#0a0f1a] relative overflow-hidden py-12 transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/5 dark:bg-[#00d4ff]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-white dark:bg-[#111827] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.08)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg relative z-10 transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-100 dark:bg-[#0a0f1a] rounded-2xl border border-cyan-300/50 dark:border-[#00d4ff]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.15)]">
            <Zap className="w-8 h-8 text-cyan-500 dark:text-[#00d4ff]" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold font-['Orbitron'] text-center text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Join the VoltPod network.</p>

        {error && (
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mb-6 bg-red-50 dark:bg-red-400/10 p-3 rounded-xl border border-red-200 dark:border-red-400/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-400 dark:focus:border-[#00d4ff] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-400 dark:focus:border-[#00d4ff] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input 
                type="password" 
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-400 dark:focus:border-[#00d4ff] transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Vehicle Info (Optional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text" 
                  name="vehicleName"
                  placeholder="EV Model"
                  value={formData.vehicleName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-400 dark:focus:border-[#00d4ff] transition-colors"
                />
              </div>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input 
                  type="number" 
                  name="batteryCapacity"
                  placeholder="Battery (kWh)"
                  value={formData.batteryCapacity}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-400 dark:focus:border-[#00d4ff] transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 dark:from-[#00d4ff] dark:to-[#00ff88] text-white dark:text-[#0a0f1a] font-bold py-4 rounded-xl text-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all flex justify-center items-center mt-6"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white dark:border-[#0a0f1a] border-t-transparent rounded-full animate-spin"></div> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Already have an account? <Link to="/login" className="text-cyan-600 dark:text-[#00d4ff] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
