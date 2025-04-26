require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connection function

// Connect to Database
connectDB(); // Call the function to establish connection

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Basic Route
app.get('/', (req, res) => {
    res.send('White-Spot Admin API Running');
});

// Define Routes (We'll add these later)
// app.use('/api/admin/auth', require('./routes/authRoutes'));
// app.use('/api/admin/products', require('./routes/productRoutes'));
// app.use('/api/admin/categories', require('./routes/categoryRoutes'));
// ... other routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Admin backend server started on port ${PORT}`));