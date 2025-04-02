const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); 
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    console.log('New room added:', room); 
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
      const room = await Room.findById(req.params.id);
      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Import rooms from Excel file
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const roomsData = xlsx.utils.sheet_to_json(sheet);

    const rooms = await Room.insertMany(roomsData);
    res.status(201).json({ message: 'Rooms imported successfully', rooms });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import rooms: ' + err.message });
  }
});

// Export rooms to Excel file
router.get('/export', async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomsData = rooms.map(room => room.toObject());

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(roomsData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Rooms');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="rooms.xlsx"');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export rooms: ' + err.message });
  }
});

module.exports = router;
