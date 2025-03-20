import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import contestRoutes from "./routes/contestRoutes.js";

// App config
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API endpoints
app.use("/api/contests", contestRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root!");
});

const port = process.env.PORT ||4000;

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


