import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import socketIO from 'socket.io';
import Seat from './model/Seat';
import initialSeats from './initialSeats';

const port = 3000;
const app = express();
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const io = socketIO.listen(server);

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('yeyy connected');

  app.get('/', (req: Request, res: Response) => {
    Seat.find(function(err, seats) {
      if (err) return console.error(err);
      console.log(seats);
      res.send(seats);
    });
  });

  app.post('/initialize', (req: Request, res: Response) => {
    initialSeats().then(() => {
      console.log('Seats initialised');
      res.send('Seats initialized');
    });
  });

  app.delete('/', function(req: Request, res: Response) {
    Seat.deleteMany((err: any) => {
      res.send('All seats removed');
    });
  });

  io.on('connection', function(socket) {
    console.log('a user connected');

    Seat.find(function(err, seats) {
      if (err) return console.error(err);
      io.emit('initialList', seats);
    });

    socket.on('reserve', function({ row, column }: { row: number; column: string }) {
      socket.broadcast.emit('reserved', { row, column });
      console.log('reserving', row, column);
      Seat.find({ row, column }, (err, seats) => {
        if (seats.length === 0) console.error('No seat found');
        seats[0].reserved = true;
        seats[0].save();
      });
    });

    socket.on('cancel', function({ row, column }: { row: number; column: string }) {
      socket.broadcast.emit('cancelled', { row, column });
      console.log('cancelling', row, column);
      Seat.find({ row, column }, (err, seats) => {
        if (seats.length === 0) console.error('No seat found');
        seats[0].reserved = false;
        seats[0].save();
      });
    });

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });
});
