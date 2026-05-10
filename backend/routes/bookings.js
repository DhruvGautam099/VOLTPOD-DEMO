const express = require('express');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { stationId, slotId, date, startTime, endTime, totalCost } = req.body;

    const newBooking = new Booking({
      userId: req.user.id,
      stationId,
      slotId,
      date,
      startTime,
      endTime,
      totalCost
    });

    const booking = await newBooking.save();

    // Update slot status to reserved (or occupied depending on logic)
    const slot = await Slot.findByIdAndUpdate(slotId, { status: 'reserved' }, { new: true });

    // Emit socket event to update all clients
    const io = req.app.get('io');
    io.emit('slotStatusChanged', { slotId, status: 'reserved', stationId });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/my
// @desc    Get user's bookings
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('stationId', 'name address')
      .populate('slotId', 'slotNumber chargerType')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Ensure user owns booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Free up the slot
    await Slot.findByIdAndUpdate(booking.slotId, { status: 'available' });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('slotStatusChanged', { slotId: booking.slotId, status: 'available', stationId: booking.stationId });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings (Admin)
// @access  Private/Admin
router.get('/', [auth, admin], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('stationId', 'name')
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
