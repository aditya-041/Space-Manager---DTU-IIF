const mongoose = require('mongoose'); 

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }
});

const roomSchema = new mongoose.Schema({
  roomType: { 
    type: String, 
    enum: ['only seat', 'small room', 'large room'], 
    required: true 
  },
  studentOrStartup: { type: String, required: true },
  leaseSignedDate: { type: Date, required: true },
  rentOverdue: { type: Boolean, default: false },
  totalMembers: { type: Number, default: 1 },
  memberDetails: [memberSchema],
  spaceAlloted: { type: String },             
  amount: { type: Number },                   
  amountInWords: { type: String },            
  rentForProperty: { type: String },          
  rentalPeriodFrom: { type: Date },           
  rentalPeriodTo: { type: Date },             
  paymentBy: { type: String },                
  paidBy: { type: String }                     
});

module.exports = mongoose.model('Room', roomSchema);
