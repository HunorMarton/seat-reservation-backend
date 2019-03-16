import mongoose, { Schema } from 'mongoose';

export interface Seat extends mongoose.Document {
  row: number;
  column: string;
  fee: number;
  reserved: boolean;
  booked: boolean;
  reserve: () => void;
}

const seatSchema: Schema<Seat> = new mongoose.Schema({
  row: Number,
  column: String,
  fee: Number,
  reserved: Boolean,
  booked: Boolean
});

seatSchema.methods.reserve = function() {
  if (this.reserved) throw Error('Seat is already reserved');
  this.reserved = true;
};

export default mongoose.model<Seat>('Seat', seatSchema);
