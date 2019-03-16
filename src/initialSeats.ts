import mongoose from 'mongoose';
import Seat from './model/Seat';

export default async () => {
  let seats: any[] = [];
  for (let i = 1; i < 32; i++) {
    const seatForRow = ['A', 'B', 'C', 'D', 'E', 'F'].map(
      column =>
        new Seat({
          row: i,
          column: column,
          fee: Math.round(Math.random() * 300),
          reserved: false
        })
    );
    seats = [...seats, ...seatForRow];
  }

  function saveSeat(seat: any) {
    new Promise((resolve, reject) =>
      seat.save((err: any, seat: any) => {
        if (err) reject(err);
        console.log(`Seat ${seat.row}${seat.column} saved`);
        resolve(seat);
      })
    );
  }

  return Promise.all(seats.map(seat => saveSeat(seat)));
};
