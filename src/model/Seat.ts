import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: Number,
  column: String,
  fee: Number,
  reserved: Boolean
});

seatSchema.methods.reserve = function() {
  if (this.reserved) throw Error('Seat is already reserved');
  this.reserved = true;
};

export default mongoose.model('Seat', seatSchema);
