import dotenv from "dotenv";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // This should show your JWT secret

import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import http from 'http';
import {Server} from 'socket.io';
import setupSocket from "./socket.js";

import roomRoutes from "./routes/roomRoutes.js"
import authRoutes from "./routes/authRoutes.js" 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);

console.log("MONGO_URI:", process.env.MONGO_URI);  // Should print the full URI

app.get('/', (req, res) => {
  res.send("Welcome to Sinchronize's backend");
});

const server = http.createServer(app);
setupSocket(server);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
});