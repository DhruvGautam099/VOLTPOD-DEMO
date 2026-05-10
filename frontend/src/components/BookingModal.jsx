import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Battery, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ station, slot, onClose }) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // 1. Added state to hold the actual booking ID
  const [bookingId, setBookingId] = useState('');
  
  const navigate = useNavigate();

  const totalCost = station.pricePerUnit * slot.powerKW * duration;

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        onClose();
        navigate('/login');
        return;
      }

      const [hours, minutes] = time.split(':');
      let endHours = parseInt(hours) + parseInt(duration);
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes}`;

      // 2. Capture the response from your backend
      const res = await axios.post('http://localhost:5000/api/bookings', {
        stationId: station._id,
        slotId: slot._id,
        date,
        startTime: time,
        endTime,
        totalCost
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 3. Save the real booking ID to state
      setBookingId(res.data._id);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to book slot');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111827] w-full max-w-md rounded-2xl border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#0a0f1a]/50">
          <h2 className="text-xl font-bold font-['Orbitron'] text-white">Book Slot {slot.slotNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle className="w-20 h-20 text-[#00ff88] mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-gray-400 mb-6">Your slot has been successfully reserved.</p>
            
            <div className="bg-[#0a0f1a] w-full p-4 rounded-xl border border-[#00ff88]/30 mb-6 flex justify-center">
               {/* 4. Use the bookingId state variable here to keep the render pure */}
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-${bookingId}&color=00ff88&bgcolor=0a0f1a`} alt="QR Code" />
            </div>
            
            <button 
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-5 mb-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-[#00d4ff]" /> Date
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0a0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                    <Clock className="w-4 h-4 text-[#00d4ff]" /> Time
                  </label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0a0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                    <Battery className="w-4 h-4 text-[#00d4ff]" /> Duration (hrs)
                  </label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#0a0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors appearance-none"
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0f1a] rounded-xl p-4 border border-gray-800 mb-6">
              <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Summary</h4>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Station</span>
                <span className="font-semibold text-white">{station.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Charger</span>
                <span className="font-semibold text-white">{slot.chargerType} ({slot.powerKW}kW)</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-300">Est. Energy</span>
                <span className="font-semibold text-white">{slot.powerKW * duration} kWh</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-300">Total</span>
                <span className="text-2xl font-bold text-[#00ff88]">₹{totalCost}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button 
              onClick={handleBook}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0f1a] font-bold py-4 rounded-xl text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#0a0f1a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirm & Pay'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;