import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createUser, getUserByUsername, getUserId } from './users.js';
import { createWallet, getWalletsWithTotalAmt, getWalletBalanceFromChain } from './wallet.js';
import { createTransaction, commitTransaction } from './transactions.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// JWT middleware
app.use((req, res, next) => {
  if (req.path === "/api/create-user" || req.path === "/api/login" || req.path === "/api"){
      next();
      return;
  }
  let token = req.headers.authorization;
  if (!token){
      res.status(401).json({error: "JWT missing"});
      return;
  }
  token = token.split(" ")[1];
  console.log(token);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err){
          res.status(401).json({error: "invalid JWT"});
          return;
      }
      req.body.username = decoded["username"];
      next();
  });
});

function cleanUsername(username) {
  if (username.startsWith('@')) {
    return username.slice(1);
  }
  return username;
}

// Simple API route
app.get("/api", (req, res) => {
  res.send("Zap backend is running!");
});

app.post("/api/create-user", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUserId = await createUser(username, hash);
    await createWallet(newUserId);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);

    let hash = user.password;
    let result = await bcrypt.compare(password, hash);
    if (result){
        let token = jwt.sign({username: username}, JWT_SECRET, {expiresIn: '1d'});
        res.status(200).json(token);
    }else{
        res.status(401).json({error: "Username or password is incorrect"});
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/initiateTransaction", async (req, res) => {
  let { senderUsername, receiverUsername, amount } = req.body;
  try {
    receiverUsername = cleanUsername(receiverUsername);
    const senderUser = await getUserByUsername(senderUsername);
    const receiverUser = await getUserByUsername(receiverUsername);
    const result = await createTransaction(senderUser.id, receiverUser.id, amount);
    return res.status(200).json(result);
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
    const { wallet_id } = await createWallet(userId);
    console.log(wallet_id);
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
