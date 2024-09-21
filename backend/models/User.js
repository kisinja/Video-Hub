const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/?d=mp',
    },
    age: {
        type: Number,
    },
    location: {
        type: String,
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bio: {
        type: String,
    },
    website: {
        type: String,
    },
    pronouns: {
        type: String,
    }
}, { timestamps: true });

// Static sign up method
userSchema.statics.signUp = async function (username, email, password) {

    /* Validation */
    if (!email || !password || !username) {
        throw new Error('All fields must be provided');
    };

    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }

    // 'this' refers to the model itself in Mongoose statics
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({ username, email, password: hashedPassword });
    if (!user) {
        throw new Error('Error creating user');
    }

    return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
    /* Validation */
    if (!email || !password) {
        throw new Error('All fields must be provided');
    };

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);