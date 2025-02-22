import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import supabase from './database/client.js';
import { connect, keyStores, KeyPair, utils } from "near-api-js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect with supabase db
(async () => {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.error("Supabase connection failed:", error.message);
    } else {
      console.log("Supabase connection successful! Sample data:", data);
    }
})();

// Simple API route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/wallet", async (req, res) => {

});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
