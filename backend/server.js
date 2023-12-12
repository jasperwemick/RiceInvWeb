require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const profileRoutes = require('./routes/profiles')
const cors = require("cors");

// express app 
const app = express();

app.use(cors());

app.use(express.json());

// log requests
app.use((req, res, next) => {
    console.log(req.method, req.path)
    next()
});

// route
app.use('/api/profiles', profileRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // request listener
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB')
            console.log('Listening active on port:', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })


