require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profiles')
const gameRoutes = require('./routes/games')
const eventRoutes = require('./routes/events')

const cors = require("cors");
const cookieParser = require('cookie-parser')

// express app 
const app = express();

if (process.env.NODE_ENV === "development"){
    console.log()
    app.use(
        cors({
            origin: "http://localhost",
            credentials: true,
        })
    );
}

if (process.env.NODE_ENV === "production"){
    app.use(
        cors({
            origin: "https://www.riceinvitational.org",
            credentials: true,
        })
    );
}

app.use(cookieParser());

app.use(express.json());


// log requests
app.use((req, res, next) => {
    console.log(req.method, req.path)
    next()
});

// route
app.use('/auth', authRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/events', eventRoutes)

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


