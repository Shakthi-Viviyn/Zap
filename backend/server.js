import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createAccount, determineTransferDistribution } from './accounts.js';
import { createWallet } from './wallet.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// Simple API route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/create-account", async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  
  try {
    const newAccount = await createAccount({ firstname, lastname, username, email, password });
    const walletId = await createWallet(newAccount.id);

    return res.status(200).json({ success: true, walletId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/transfer", async (req, res) => {
  const { sender, reciever, amount } = req.body;
  try {
    const transactionFee = determineTransferDistribution(sender, amount);

    return res.status(200).json({ success: true, transactionFee});
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
