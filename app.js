console.log("✅ app.js is running...");

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Ensure correct path and filename

const app = express();

// MongoDB Connection
console.log("🔗 Connecting to MongoDB...");
mongoose.connect("mongodb+srv://Admin:Admin123@cluster0.agnyt7f.mongodb.net/LoginApp?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:\n", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'hbs');

// ROUTES

// Login Page
app.get('/', (req, res) => {
  console.log("📥 GET / - Rendering login page");
  res.render('login');
});

// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`📥 POST /login - Attempting login for user: ${username}`);
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.warn("⚠️ User not found:", username);
      return res.render('error', { message: '❌ User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log(`✅ Login successful for user: ${username}`);
      res.render('welcome', { username: user.username });
    } else {
      console.warn(`❌ Incorrect password for user: ${username}`);
      res.render('error', { message: '❌ Incorrect password' });
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    res.render('error', { message: '❌ Something went wrong!' });
  }
});

// Register test user
app.get('/register', async (req, res) => {
  console.log("🔧 GET /register - Creating test user 'admin' if not exists");
  
  try {
    const existing = await User.findOne({ username: "admin" });
    if (!existing) {
      const hash = await bcrypt.hash("admin123", 10);
      await User.create({ username: "admin", password: hash });
      console.log("✅ Test user created: admin / admin123");
      res.send("✅ User created: admin / admin123");
    } else {
      console.log("⚠️ Test user 'admin' already exists");
      res.send("⚠️ User already exists.");
    }
  } catch (err) {
    console.error("❌ Register error:", err);
    res.send("❌ Error creating user.");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at: http://localhost:${PORT}`);
});

console.log("✅ App.js loaded successfully");
