require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// Origins for CORS (Cross-Origin Resource Sharing) Policy
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(express.json());
app.use(morgan('common'));
app.use(cors({
    origins: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// db.js
const connectDB = require('./db');

// port
const port = process.env.PORT || 5000;

// Start Server function
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
startServer();

// Serving static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Making the 'uploads' directory publicly accessible
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);