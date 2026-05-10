const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Station = require('./models/Station');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Station.deleteMany();
  await Slot.deleteMany();
  await Booking.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // 1. Create Core Users
  const admin = await User.create({
    name: 'Hackathon Admin',
    email: 'admin@chargemate.com',
    password: hashedPassword,
    role: 'admin'
  });

  const operator = await User.create({
    name: 'Bhopal Charging Networks',
    email: 'operator@chargemate.com',
    password: hashedPassword,
    role: 'operator'
  });

  const standardUser = await User.create({
    name: 'Test Driver',
    email: 'user@chargemate.com',
    password: hashedPassword,
    role: 'user'
  });

  // 2. Bhopal Station Data (20 Stations)
  const stationLocations = [
    { name: 'MP Nagar Fast Charging Hub', address: 'Zone-I, MP Nagar', lat: 23.2332, lng: 77.4345, price: 18 },
    { name: 'BHEL Smart EV Station', address: 'BHEL Township', lat: 23.2458, lng: 77.4721, price: 15 },
    { name: 'New Market AutoCharge', address: 'New Market', lat: 23.2343, lng: 77.4005, price: 20 },
    { name: 'Rani Kamlapati Station EV Hub', address: 'Habibganj Railway Station', lat: 23.2265, lng: 77.4362, price: 19 },
    { name: 'Kolar Road PowerPoint', address: 'Kolar Road Main', lat: 23.1815, lng: 77.4120, price: 16 },
    { name: 'Awadhpuri Green Grid', address: 'Awadhpuri Bypass', lat: 23.2205, lng: 77.4812, price: 15 },
    { name: 'Indrapuri TechChargers', address: 'Indrapuri Sector A', lat: 23.2512, lng: 77.4650, price: 17 },
    { name: 'Lalghati Junction EV', address: 'Lalghati Square', lat: 23.2845, lng: 77.3685, price: 18 },
    { name: 'Sant Hirdaram Nagar Point', address: 'Bairagarh Main Road', lat: 23.2882, lng: 77.3298, price: 16 },
    { name: 'Ayodhya Bypass FastCharge', address: 'Ayodhya Bypass Road', lat: 23.2721, lng: 77.4610, price: 18 },
    { name: 'Arera Colony Premium EV', address: 'E-3 Arera Colony', lat: 23.2085, lng: 77.4300, price: 22 },
    { name: 'Shahpura Lake View Chargers', address: 'Shahpura Lake Promenade', lat: 23.2001, lng: 77.4190, price: 20 },
    { name: 'Govindpura Industrial Grid', address: 'Govindpura Industrial Area', lat: 23.2558, lng: 77.4521, price: 14 },
    { name: 'Hoshangabad Road EV Plaza', address: 'DB City Mall Environs, Hoshangabad Rd', lat: 23.1852, lng: 77.4470, price: 19 },
    { name: 'Bhadbhada Eco Charge', address: 'Bhadbhada Square', lat: 23.2105, lng: 77.3621, price: 17 },
    { name: 'Chuna Bhatti Connect', address: 'Chuna Bhatti Square', lat: 23.1950, lng: 77.4100, price: 18 },
    { name: 'Bhopal Junction Hub', address: 'Nadra Bus Stand Area', lat: 23.2661, lng: 77.4140, price: 17 },
    { name: 'Karond Smart Charge', address: 'Karond Bypass', lat: 23.3051, lng: 77.4152, price: 15 },
    { name: 'Minal Residency Station', address: 'Minal Residency Gate 1', lat: 23.2650, lng: 77.4680, price: 16 },
    { name: 'Raja Bhoj Airport EV Terminal', address: 'Airport Terminal Parking', lat: 23.3168, lng: 77.3392, price: 25 }
  ];

  // 3. Create the Stations & Slots dynamically
  let firstStationId = null;

  for (let i = 0; i < stationLocations.length; i++) {
    const loc = stationLocations[i];
    
    // Create Station
    const station = await Station.create({
      operatorId: operator._id,
      name: loc.name,
      address: loc.address,
      coordinates: { lat: loc.lat, lng: loc.lng },
      totalSlots: 3, // We will generate 3 slots per station
      chargerTypes: ['Type 2', 'CCS', 'CHAdeMO'],
      pricePerUnit: loc.price,
      operatingHours: '24/7',
      rating: (Math.random() * (5 - 4) + 4).toFixed(1) // Random rating between 4.0 and 5.0
    });

    if (i === 0) firstStationId = station._id;

    // Create 3 Slots for each station
    await Slot.create([
      { 
        stationId: station._id, 
        slotNumber: 1, 
        chargerType: 'CCS', 
        powerKW: 50, 
        // Make roughly 20% of slots occupied/reserved for realism
        status: Math.random() > 0.8 ? 'occupied' : 'available' 
      },
      { 
        stationId: station._id, 
        slotNumber: 2, 
        chargerType: 'Type 2', 
        powerKW: 22, 
        status: 'available' 
      },
      { 
        stationId: station._id, 
        slotNumber: 3, 
        chargerType: 'CHAdeMO', 
        powerKW: 150, 
        // Occasional maintenance status
        status: Math.random() > 0.9 ? 'maintenance' : 'available' 
      }
    ]);
  }

  // 4. Create a dummy completed booking for the Operator Dashboard
  if (firstStationId) {
    await Booking.create({
      userId: standardUser._id,
      stationId: firstStationId,
      slotId: firstStationId, 
      date: '2026-05-13',
      startTime: '10:00',
      endTime: '11:00',
      status: 'completed',
      totalCost: 450
    });
  }

  console.log('Database successfully seeded with 20 Bhopal stations!');
  process.exit();
};

seedDatabase();