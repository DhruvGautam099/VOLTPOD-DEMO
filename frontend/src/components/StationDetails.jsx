import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Zap, Clock, BatteryCharging, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import BookingModal from './BookingModal';

const StationDetails = ({ station, onBack }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // AI Optimizer State
  const [carModel, setCarModel] = useState('Tata Nexon EV');
  const [currentBat, setCurrentBat] = useState(20);
  const [targetBat, setTargetBat] = useState(80);
  const [aiResult, setAiResult] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stations/${station._id}/slots`);
        setSlots(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setLoading(false);
      }
    };
    fetchSlots();
  }, [station._id]);

  const handleBook = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    setAiResult('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ai/optimize', {
        stationId: station._id,
        carModel,
        currentBattery: currentBat,
        targetBattery: targetBat
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiResult(res.data.recommendation);
    } catch (err) {
      setAiResult("⚠️ Connect your API or log in to use the AI Optimizer.");
    }
    setOptimizing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-white dark:bg-[#0a0f1a] transition-colors duration-300"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
        </button>
        <h2 className="font-bold text-lg text-gray-800 dark:text-white truncate">{station.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0f1a] to-transparent z-10 transition-colors duration-300" />
          <img 
            src={`https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&w=800&q=80`} 
            alt={station.name} 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="p-6 -mt-10 relative z-20">

          {/* Station Info Card */}
          <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm mb-6 transition-colors">
            <div className="flex items-start justify-between text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-indigo-500" />
                <p className="text-sm">{station.address}</p>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=$${station.coordinates?.lat || ''},${station.coordinates?.lng || ''}`}
                target="_blank" 
                rel="noreferrer"
                className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-xs px-3 py-1.5 rounded-lg font-semibold flex shrink-0 transition-colors ml-2"
              >
                Get Directions
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><Zap className="w-4 h-4 text-yellow-500" /></div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-semibold text-gray-800 dark:text-white">₹{station.pricePerUnit}/kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><Clock className="w-4 h-4 text-green-500" /></div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hours</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{station.operatingHours || '24/7'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI OPTIMIZER CARD */}
          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5 mb-8">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> AI Charge Optimizer
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Your Vehicle</label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Current %</label>
                  <input
                    type="number"
                    value={currentBat}
                    onChange={(e) => setCurrentBat(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-800 dark:text-white transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Target %</label>
                  <input
                    type="number"
                    value={targetBat}
                    onChange={(e) => setTargetBat(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-800 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleOptimize}
                disabled={optimizing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {optimizing ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {optimizing ? 'Calculating...' : 'Calculate Time & Cost'}
              </button>

              {/* AI Result Box */}
              {aiResult && (
                <div className="mt-4 p-4 bg-white dark:bg-[#111827] rounded-xl border border-indigo-100 dark:border-indigo-800 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed shadow-sm transition-colors">
                  {aiResult}
                </div>
              )}
            </div>
          </div>

          <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-indigo-500" />
            Hardware Status
          </h3>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div key={slot._id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between transition-colors shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 dark:text-white">Slot {slot.slotNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{slot.chargerType}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{slot.powerKW} kW</div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        slot.status === 'available' ? 'bg-green-500 animate-pulse' : 
                        slot.status === 'occupied' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {slot.status}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleBook(slot)}
                      disabled={slot.status !== 'available'}
                      className={`text-sm px-4 py-1.5 rounded-lg font-bold transition-all ${
                        slot.status === 'available' 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal 
          station={station} 
          slot={selectedSlot} 
          onClose={() => setIsBookingModalOpen(false)} 
        />
      )}
    </motion.div>
  );
};

export default StationDetails;