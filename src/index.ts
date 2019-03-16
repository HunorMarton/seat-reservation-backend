import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Seat from './model/Seat';
import initialSeats from './initialSeats';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('yeyy connected');

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.get('/', (req: Request, res: Response) => {
    Seat.find(function(err: any, seats: any) {
      if (err) return console.error(err);
      console.log(seats);
      res.send(seats);
    });
  });

  app.post('/initialize', (req, res) => {
    initialSeats().then(() => {
      console.log('Seats initialised');
      res.send('Seats initialized');
    });
  });

  app.delete('/', function(req, res) {
    Seat.deleteMany((err: any, seats: any) => {
      res.send('All seats removed');
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
