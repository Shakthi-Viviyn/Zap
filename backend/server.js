import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createAccount, determineTransferDistribution, getAccount, getAccountByUsername, getAccountId } from './accounts.js';
import { createWallet, getWallets, refreshAllWallets } from './wallet.js';
import { commitTransaction } from './transactions.js';

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

app.post("/api/create-account", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newAccountId = await createAccount(username, password);
    await createWallet(newAccountId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const account = await getAccountByUsername(username);
    if (account.password !== password) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/initiateTransaction", async (req, res) => {
  const { senderUsername, receiverUsername, amount } = req.body;
  try {
    const senderAccount = await getAccountByUsername(senderUsername);
    const receiverAccount = await getAccountByUsername(receiverUsername);
    const transactionId = determineTransferDistribution(senderAccount.id, receiverAccount.id, amount);

    return res.status(200).json({ transactionFee: 0, transactionId});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/commitTransaction", async (req, res) => {
  const { transactionId, username } = req.body;
  try {
    const account = await getAccountByUsername(username);
    await commitTransaction(transactionId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/totalBalanace", async (req, res) => {
  const { username } = req.body;
  try {
    const account = await getAccountByUsername(username);
    return res.status(200).json({ totalBalance: account.total_balance });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/getAllWallets", async (req, res) => {
  const { username } = req.body;
  try {
    const account = await getAccountByUsername(username);
    const wallets = await getWallets(account.id);
    return res.status(200).json(wallets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/refreshAllWallets", async (req, res) => {
  const { username } = req.body;
  try {
    const account = await getAccountByUsername(username);
    const newBalance = await refreshAllWallets(account.id);
    return res.status(200).json({ wallets, newBalance });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
