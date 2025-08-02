const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'CivicTrack API is running!',
    version: '1.0.0'
  });
});

// Simple test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.get('/api/test/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Add auth routes
app.use('/api/auth', require('./routes/auth'));

// Add issues routes
app.use('/api/issues', require('./routes/issues'));

// Add admin routes
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 