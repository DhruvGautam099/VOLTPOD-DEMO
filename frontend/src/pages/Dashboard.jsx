import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Calendar, Clock, MapPin, Zap, XCircle, Battery } from 'lucide-react';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsData = () => {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setBookings(res.data);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
    };

    fetchBookingsData();
    const socket = io('http://localhost:5000');
    socket.on('slotStatusChanged', fetchBookingsData);
    return () => socket.close();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get('http://localhost:5000/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    // Added dark:bg-[#0a0f1a]
    <div className="h-full overflow-y-auto p-8 bg-[#eef2f6] dark:bg-[#0a0f1a] custom-scrollbar transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          {/* Added dark:text-white */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Dashboard Overview</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Added dark classes to the main card */}
            <div className="bg-[#f8fafc] dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[500px] transition-colors duration-300">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Recent Bookings</h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center text-gray-400 p-12">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>No active bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-50 dark:bg-[#0a0f1a]/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 transition-colors">
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                              booking.status === 'upcoming' || booking.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              booking.status === 'completed' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {booking.status}
                            </span>
                            <span className="text-xs font-bold text-gray-400">Slot {booking.slotId?.slotNumber}</span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white">{booking.stationId?.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {booking.stationId?.address}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end justify-between">
                          <div className="text-right">
                            <p className="font-bold text-xl text-gray-800 dark:text-white">₹{booking.totalCost}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mt-1">
                              <Calendar className="w-3.5 h-3.5" /> {booking.date}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                              <Clock className="w-3.5 h-3.5" /> {booking.startTime} - {booking.endTime}
                            </p>
                          </div>
                          
                          {(booking.status === 'upcoming' || booking.status === 'active') && (
                            <button 
                              onClick={() => handleCancel(booking._id)}
                              className="mt-4 sm:mt-0 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Cancel Slot
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Card 1 */}
            <div className="bg-[#f8fafc] dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-widest">Live AI Insights</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white">Best station right now</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP Nagar Hub • 2 free slots • ₹18/kWh</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Clock className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white">Best time to charge today</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2:00–4:00 PM — lowest predicted wait</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <Battery className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white">Vs petrol this week</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You saved ~₹640 by charging EV</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f8fafc] dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
               <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-widest">Predicted Wait Times</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-300 font-medium">Now</span>
                   <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                     <div className="w-1/3 bg-green-500 rounded-full"></div>
                   </div>
                   <span className="text-green-500 font-bold text-xs w-8 text-right">Low</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-300 font-medium">5 PM</span>
                   <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                     <div className="w-2/3 bg-yellow-500 rounded-full"></div>
                   </div>
                   <span className="text-yellow-500 font-bold text-xs w-8 text-right">High</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-300 font-medium">7 PM</span>
                   <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                     <div className="w-full bg-red-500 rounded-full"></div>
                   </div>
                   <span className="text-red-500 font-bold text-xs w-8 text-right">Peak</span>
                 </div>
               </div>
               <p className="text-[10px] text-gray-400 mt-4 text-center">AI-predicted - MP Nagar Hub</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;