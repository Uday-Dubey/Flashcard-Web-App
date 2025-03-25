const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authrouter = require("./routes/authRoutes");
const folderRouter = require("./routes/folderRoutes");
const flashcardRouter = require("./routes/flashcardRoutes");
const dotenv = require("dotenv");
dotenv.config();

const port = 80;
const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',authrouter);
app.use('/api/folder',folderRouter);
app.use('/api/flashcard', flashcardRouter);

// EXPRESS SPECIFIC STUFF
app.use('/public', express.static(path.join(__dirname, 'public')));

// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, 'views'));

// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('landing.pug');
});
app.get('/about', (req, res) => {
    res.status(200).render('about-us.pug');
});
app.get('/services', (req, res) => {
    res.status(200).render('services.pug');
});
app.get('/dashboard', (req, res) => {
    res.status(200).render('dashboard.pug');
});
app.get('/flashcard', (req,res)=>{
    res.status(200).render('flashcard.pug');
});

// MongoDB Connection
mongoose
    .connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => console.error('Failed to connect to database:', err.message));

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
