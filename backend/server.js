const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const hallRoutes = require('./routes/halls');
const seatRoutes = require('./routes/seats');
const showtimeRoutes = require('./routes/showtimes');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Test route
app.get('/', (req, res) => res.send('CineBook Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
