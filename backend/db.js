const mongoose = require('mongoose');
const { string } = require('zod');

// Simple MongoDB connection
mongoose.connect("mongodb://host.docker.internal:27017/paytm?replicaSet=rs&directConnection=true")
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => console.error('✗ MongoDB Error:', err));

mongoose.connection.on('error', (err) => {
    console.error('Connection error:', err.message);
});

// mongoose schema for the users tabl


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// create a model from the schema

const User = mongoose.model('User',userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account',accountSchema);

module.exports = {
    User,
    Account
};
