import { faker } from '@faker-js/faker';
import { createAccount } from "../accounts.js";
import { createWallet } from "../wallet.js";
import dotenv from "dotenv";

dotenv.config();

// async function seedDatabase() {
//   console.log("Starting seed process...");

//   const accounts = [];

//   for (let i = 0; i < 15; i++) {
//       const firstname = faker.person.firstName();
//       const lastname = faker.person.lastName();
//       const username = faker.internet.username();
//       const email = faker.internet.email({ firstname, lastname });
//       const password = faker.internet.password();
//       accounts.push({ firstname, lastname, username, email, password });
//   }

//   for (const account of accounts) {
//       try {
//           const newAccount = await createAccount(account);
//           const wallet = await createWallet(newAccount.id);
//           console.log(`Account ${newAccount.id} created with Wallet: ${wallet.wallet_id}`);
//       } catch (error) {
//           console.error(`${error.message}`);
//       }
//   }

//   console.log("Seeding process completed!");
// }

// // Run the seeding script
// seedDatabase().catch(console.error);


// async function addWalletsForAccounts(accountIds, walletsPerAccount = 3) {
//   try {
//       // Iterate over each account and create wallets
//       for (const accountId of accountIds) {
//           console.log(`Creating wallets for account ID: ${accountId}`);

//           for (let i = 0; i < walletsPerAccount; i++) {
//               try {
//                   const newWallet = await createWallet(accountId);
//                   console.log(`Wallet created for Account ${accountId}:`, newWallet.wallet_id);
//               } catch (walletError) {
//                   console.error(`Error creating wallet for Account ${accountId}:`, walletError.message);
//               }
//           }
//       }

//       console.log("Wallet creation process complete!");
//   } catch (error) {
//       console.error("Error in addWalletsForAccounts:", error.message);
//   }
// }

// // Run the script with specified accounts
// addWalletsForAccounts([133, 134, 135]);