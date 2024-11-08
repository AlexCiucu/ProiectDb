const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Adăugăm JWT pentru verificarea token-ului
require('dotenv').config(); // Adăugarea configurării dotenv

// Import models
const User = require('./models/User');
const Viewer = require('./models/Viewer');
const Artwork = require('./models/Artwork');
const Event = require('./models/Event');
const Resource = require('./models/Resource');

const app = express();
app.use(express.static('frontend'));
app.use(bodyParser.json());
app.use(expressLayouts);
app.set("view engine", "ejs");

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Adaugă middleware pentru a verifica token-ul și a extrage rolul utilizatorului
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
    } catch (error) {
      console.error('Token error:', error.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Routes
app.get(['/home', '/about', '/events', '/gallery', '/members', '/createaccount', '/login'], (req, res) => {
  res.render('index', { page: 'home' });
});

app.get("/health&wellbeing", (req, res) => {
  res.sendFile(path.join(__dirname, 'images/Health&Wellbeing.jpg'));
})

app.get('/login', (req, res) => {
  res.render('login', { page: 'home' });
});

app.get('/payment', (req, res) => {
  res.render('index', { page: 'payment' });
});

// Add a route to handle GET requests for events
app.get('/getevents', async (req, res) => {
  try {
    // Fetch events from the database
    const events = await Event.find();
    console.log(events);
    // Send the fetched events as a JSON response
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createaccount', async (req, res) => {
  try {
    const { name, surname, username, email, password } = req.body;
    // Check if user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({ name, surname, username, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Adaugă rută pentru adăugarea evenimentului
app.post('/events', (req, res) => {
  // Verify if the user is an admin
  console.log(req.user);
  /*if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
  }*/
  // Create the event in the database
  const newEvent = new Event(req.body);
  newEvent.save()
      .then(event => res.json(event))
      .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.get('/create_event', (req, res) => {
  // Verify if the user is an admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Create the HTML content dynamically
  const dynamicPageContent = `
      <h2>Create Event</h2>
      <form id="createEventForm">
          <label>Event Name:</label>
          <input type="text" id="eventName" required><br>
          <label>Date:</label>
          <input type="date" id="eventDate" required><br>
          <label>Location:</label>
          <input type="text" id="eventLocation" required><br>
          <label>Description:</label>
          <textarea id="eventDescription" rows="4" cols="50" required></textarea><br>
          <button type="submit">Create Event</button>
      </form>
      <div id="message"></div>
  `;

  // Send the dynamically created page content as the response
  res.send(dynamicPageContent);
});

app.get('/members', async (req, res) => {
  try {
    // Verifică dacă utilizatorul este autentificat și este un admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Găsește toți utilizatorii din baza de date
    const users = await User.find();

    // Returnează lista de utilizatori în format JSON
    res.json(users);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/home`);
});
