import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve seats
const reserveSeat = async (number) => {
    await setAsync('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
    const seats = await getAsync('available_seats');
    return parseInt(seats) || 0;
};

// Initialize the number of available seats and reservation status
reserveSeat(50);
let reservationEnabled = true;

// Create a Kue queue
const queue = kue.createQueue();

// Create an Express server
const app = express();
const PORT = 1245;

// Middleware to parse JSON requests
app.use(express.json());

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
});

// Route to process the queue and reserve seats
app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === 0) {
        reservationEnabled = false;
    }

    queue.process('reserve_seat', async (job, done) => {
        const currentSeats = await getCurrentAvailableSeats();
        if (currentSeats > 0) {
            await reserveSeat(currentSeats - 1);
            done();
        } else {
            done(new Error('Not enough seats available'));
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
