import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

import authRoutes from "./routes/auth";
const profileRoutes = require('./routes/profiles')
const gameRoutes = require('./routes/games')
const eventRoutes = require('./routes/events')

configDotenv()

// express app 
const app = express();

if (process.env.NODE_ENV === "development"){
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );
}

if (process.env.NODE_ENV === "production"){
    app.use(
        cors({
            origin: "https://rice.riceinvitational.org",
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

const httpServer = createServer(app);

if (!process.env.MONGO_URI) {
    throw new Error("Missing URI");
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // request listener
        httpServer.listen(process.env.PORT, () => {
            console.log('Connected to DB')
            console.log('Listening active on port:', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })


