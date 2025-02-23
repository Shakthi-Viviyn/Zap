import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createUser, getUserByUsername, getUserId } from './users.js';
import { createWallet, getWalletsWithTotalAmt, getWalletBalanceFromChain } from './wallet.js';
import { createTransaction, commitTransaction } from './transactions.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple API route
app.get("/api", (req, res) => {
  res.send("Backend is running!");
});

app.post("/api/create-user", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUserId = await createUser(username, password);
    const { walletId } = await createWallet(newUserId);
    console.log(walletId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await getUserByUsername(username);
    console.log(user);
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/initiateTransaction", async (req, res) => {
  const { senderUsername, receiverUsername, amount } = req.body;
  console.log(req.body);
  try {
    const senderUser = await getUserByUsername(senderUsername);
    const receiverUser = await getUserByUsername(receiverUsername);
    const transactionId = await createTransaction(senderUser.id, receiverUser.id, amount);
    return res.status(200).json({ transactionFee: 0, transactionId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/commitTransaction", async (req, res) => {
  const { transactionId, username } = req.body;
  try {
    await commitTransaction(transactionId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Try to avoid this route unless necessary
app.get("/api/totalBalanace", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await getUserByUsername(username);
    const { totalBalance } = await getWalletsWithTotalAmt(user.id);
    return res.status(200).json({ totalBalance: totalBalance });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/wallets", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await getUserByUsername(username);
    const { wallets, totalBalance } = await getWalletsWithTotalAmt(user.id);
    return res.status(200).json({wallets, totalBalance});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-wallet", async (req, res) => {
  const { userId } = req.body;
  try {
    const { walletId } = await createWallet(userId);
    console.log(walletId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/getWalletBalance", async (req, res) => {
  try {
    const { walletId } = req.body;
    const balance = await getWalletBalanceFromChain(walletId);
    return res.status(200).json({ walletId, balance });
  }catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
