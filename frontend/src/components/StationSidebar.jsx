import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, Star } from 'lucide-react';
import StationDetails from './StationDetails';

const StationSidebar = ({ stations, loading, onSelect, selectedStation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (station) => {
    onSelect(station);
    setShowDetails(true);
  };

  return (
    <motion.div 
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      className="w-full md:w-[400px] h-full bg-[#0a0f1a]/95 backdrop-blur-xl border-r border-[#00ff88]/20 flex flex-col z-10 absolute md:relative top-0 left-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
    >
      <AnimatePresence mode="wait">
        {showDetails && selectedStation ? (
          <StationDetails 
            station={selectedStation} 
            onBack={() => setShowDetails(false)} 
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            <div className="p-6 pb-2">
              <h2 className="text-2xl font-bold font-['Orbitron'] text-white mb-4">Stations Near You</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search area or station name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff88]"></div>
                </div>
              ) : filteredStations.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">No stations found</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredStations.map((station) => (
                    <motion.div 
                      key={station._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(station)}
                      className={`bg-[#111827] border p-4 rounded-xl cursor-pointer transition-all ${selectedStation?._id === station._id ? 'border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.1)]' : 'border-gray-800 hover:border-[#00ff88]/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-lg leading-tight">{station.name}</h3>
                        <div className="flex items-center gap-1 bg-[#00ff88]/10 px-2 py-1 rounded text-[#00ff88] text-xs font-bold">
                          <Star className="w-3 h-3 fill-[#00ff88]" />
                          {station.rating}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{station.address}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {station.chargerTypes.map(type => (
                          <span key={type} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                            {type}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div className="flex items-center gap-1 text-[#00d4ff] font-semibold">
                          <Zap className="w-4 h-4" />
                          <span>₹{station.pricePerUnit}/kWh</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {station.totalSlots} slots
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StationSidebar;
