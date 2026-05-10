import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Zap, Clock, BatteryCharging } from 'lucide-react';
import axios from 'axios';
import BookingModal from './BookingModal';

const StationDetails = ({ station, onBack }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-[#0a0f1a]"
    >
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        <h2 className="font-bold text-lg font-['Orbitron'] truncate">{station.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="h-48 bg-gray-800 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent z-10" />
          <img 
            src={`https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&w=800&q=80`} 
            alt={station.name} 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="p-6 -mt-10 relative z-20">
          <div className="bg-[#111827] rounded-xl p-5 border border-gray-800 shadow-lg mb-6">
            
            {/* UPDATED NAVIGATION SECTION */}
            <div className="flex items-start justify-between text-gray-300 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#00ff88]" />
                <p>{station.address}</p>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`}
                target="_blank" 
                rel="noreferrer"
                className="bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/20 text-xs px-3 py-1.5 rounded-lg font-semibold flex shrink-0 transition-colors ml-2"
              >
                Get Directions
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-800 rounded-lg"><Zap className="w-4 h-4 text-[#00d4ff]" /></div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-semibold text-white">₹{station.pricePerUnit}/kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-800 rounded-lg"><Clock className="w-4 h-4 text-[#00ff88]" /></div>
                <div>
                  <p className="text-xs text-gray-500">Hours</p>
                  <p className="font-semibold text-white">{station.operatingHours || '24/7'}</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-xl mb-4 font-['Orbitron'] flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-[#00ff88]" />
            Charging Slots
          </h3>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff88]"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div key={slot._id} className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Slot {slot.slotNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">{slot.chargerType}</span>
                    </div>
                    <div className="text-sm text-gray-400">{slot.powerKW} kW</div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        slot.status === 'available' ? 'bg-[#00ff88] animate-pulse' : 
                        slot.status === 'occupied' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        {slot.status}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleBook(slot)}
                      disabled={slot.status !== 'available'}
                      className={`text-sm px-4 py-1.5 rounded-lg font-bold transition-all ${
                        slot.status === 'available' 
                        ? 'bg-[#00ff88] text-[#0a0f1a] hover:bg-[#00d4ff] hover:shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Book
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