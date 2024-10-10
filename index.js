// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const movieRoutes = require('./src/routes/routes'); // Import the movie routes
const {logger,handleNotFound} = require('./src/middleware/middleware');
const fs = require('fs');
dotenv.config({ path: './config.env' });

// Initialize MongoDB connection
const InitiateMongoServer = require('./db');
InitiateMongoServer();

// Initialize the express app
const app = express();

//Read data from movies.json
const data = JSON.parse(fs.readFileSync('./movies.json','utf-8'));
//console.log(data);
//Function to import movies from JSON
const importMovies = async (req, res) => {
    try {
        const count = await Movie.countDocuments();
        if (count === 0) {
            
            await Movie.create(data);
            console.log('Data successfully imported to MongoDb');
            res.status(200).send('Data successfully imported');
        } else {
            console.log('Data already exists in the database, skipping import');
            res.status(200).send('Data already exists, skipping import');
        }
    } catch (e) {
        console.error('Error importing data',e);
        
    }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);//apply logger middleware


// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the first program of Node.js Express');
});

// Use the movie routes
app.use('/movie', movieRoutes); // This will include all routes defined in routes.js

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(handleNotFound);//404 handler for routes not defined