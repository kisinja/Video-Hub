require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/User');
const Notification = require('./models/Notification');

const app = express();

// Origins for CORS (Cross-Origin Resource Sharing) Policy
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(express.json());
app.use(morgan('common'));
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// db.js
const connectDB = require('./db');

// port
const port = process.env.PORT || 5000;

// socket io port
const socketPort = process.env.SOCKET_PORT || 5000;

// create a http server
const server = http.createServer(app);

// create a socket.io instance
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});

// Object to track users and their statuses
const users = {};

// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a user connects, we store their socket id in the users object
    socket.on('user_connected', (userId) => {
        users[userId] = { socketId: socket.id, online: true };

        // Emit an event to all connected clients to update the user status
        io.emit('user_status_update', users);
    });

    // When a user disconnects, we set their status to offline
    socket.on('disconnect', () => {
        for (const userId in users) {
            if (users[userId].socketId === socket.id) {
                users[userId].online = false;
                break;
            }
        }
        io.emit('user_status_update', users);
    });

    // Handle live stream signaling
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        // Notify all users in the room about the new live stream
        io.to(roomId).emit('user-connected', userId);

        // Create a notification for all users except the one who started the stream
        User.find({ _id: { $ne: userId } }) // Get all users except the one who created the room
            .then(users => {
                users.forEach(user => {
                    const notification = new Notification({
                        type: 'live_stream',
                        recipient: user._id,
                        triggeredBy: userId,
                        content: `User ${userId} has started a live stream.`,
                    });
                    notification.save();
                });
            });

        // Handle offers
        socket.on('offer', (offer) => {
            socket.to(roomId).emit('offer', offer);
        });

        // Handle answers
        socket.on('answer', (answer) => {
            socket.to(roomId).emit('answer', answer);
        });

        // Handle ICE candidates
        socket.on('ice-candidate', (candidate) => {
            socket.to(roomId).emit('ice-candidate', candidate);
        });
    });
});

// Start Server function
const startServer = async () => {
    try {
        await connectDB();
        server.listen(socketPort, () => {
            console.log(`Socket.io server running on port ${socketPort}`);
        });

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