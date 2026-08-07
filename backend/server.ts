import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

import authRoutes from "./routes/auth";
import profileRoutes from './routes/profiles';
import gameRoutes from './routes/games';
import eventRoutes from './routes/events';
import tournamentRoutes from './routes/tournaments';
import path from "path";
import { error } from "console";

configDotenv()

// express app 
const app = express();

// if (process.env.NODE_ENV === "development") {
//     app.use(
//         cors({
//             origin: "http://localhost:5173",
//             credentials: true,
//         })
//     );
// }

if (process.env.NODE_ENV === "production") {
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
app.use('/api/tournament', tournamentRoutes)

// Serve frontend
// if (process.env.NODE_ENV === "production") {
//     const clientBuildPath = path.join(__dirname, '../client/dist');
//     app.use(express.static(clientBuildPath));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(clientBuildPath, 'index.html'));
//     });
// }

app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    res.status(500).json({ error : err.message || "Server Explosion" });
});

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


