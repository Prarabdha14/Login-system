const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
});

// Create model
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;
