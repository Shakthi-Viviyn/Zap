import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";
import supabase from "./database/client.js";
import Decimal from "decimal.js";

dotenv.config();

const rootPrivateKey = process.env.ROOT_PRIVATE_KEY;
const rootWalletId = process.env.ROOT_WALLET_ID;
const myKeyStore = new keyStores.InMemoryKeyStore();

const keyPair = KeyPair.fromString(rootPrivateKey);
await myKeyStore.setKey("testnet", rootWalletId, keyPair);

const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
};

const storeLessConnection = await connect({
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
});

const nearConnection = await connect(connectionConfig);
const rootWallet = await nearConnection.account(rootWalletId);

/*
 Pass in the userId as string
*/
export async function createWallet(userId) {

    const newWalletId = Date.now() + "-zap.testnet";

    const newKeyPair = KeyPair.fromRandom("ed25519");
    const newPublicKey = newKeyPair.getPublicKey().toString();
    const newPrivateKey = newKeyPair.toString();

    const createWalletResult = await rootWallet.functionCall({
        contractId: "testnet",
        methodName: "create_account",
        args: {
          new_account_id: newWalletId, // example-account.testnet
          new_public_key: newPublicKey, // ed25519:2ASWc...
        },
        attachedDeposit: utils.format.parseNearAmount("0"), // Initial empty balance for account in yoctoNEAR
    });

    if (createWalletResult.status.SuccessValue) {
        const { error } = await supabase.from("wallet").insert(
            {
                user_id: userId,
                private_key: newPrivateKey,
                public_key: newPublicKey,
                wallet_id: newWalletId
            }
        )

        if (error){
            throw new Error(`Error creating wallet: ${error.message}`);
        }
    }
}

export async function getWalletsWithTotalAmt(userId) {

    let { error, data } = await supabase.from("wallet")
        .select("wallet_id")
        .eq("user_id", userId)

    if (error){
        throw new Error(`Error getting wallets: ${error.message}`);
    }
    return fetchWalletBalances(data);
}

export async function getWallets(userId){
    let { wallets } = await getWalletsWithTotalAmt(userId);
    return wallets;
}

function cleanNearAmount(amount) {
    if (amount.includes('-')) {
        return '0'
    }
    return amount
}

/* returns balance of a single wallet as a float number */
export async function getWalletBalanceFromChain(walletId) {
    const wallet = await storeLessConnection.account(walletId);
    const nearAmount = utils.format.formatNearAmount((await wallet.getAccountBalance()).total);
    return cleanNearAmount(nearAmount);
}

/* returns the new total balance after syncing blockchain balances of all wallets belonging to user down to the DB */
export async function fetchWalletBalances(wallets){
    let totalBalance = new Decimal(0)
    wallets = await Promise.all(wallets.map(async (wallet) => {
            const balance = await getWalletBalanceFromChain(wallet.wallet_id);
            totalBalance = totalBalance.plus(balance);
            return {
                wallet_id: wallet.wallet_id,
                amount: balance
            }
        }
    ));
    return { wallets, totalBalance };
}

export async function splitWallet(walletId, difference) {

    const { data, error } = await supabase.from("wallet").select("*").eq("wallet_id", walletId);

    if (error) {
        throw new Error(`Error getting wallet keys for splitting: ${error.message}`);
    }

    const wallet = data[0];
    const userId = wallet.user_id;

    const keyPair = KeyPair.fromString(wallet.private_key);
    await myKeyStore.setKey("testnet", walletId, keyPair);

    // Create a connection to the NEAR testnet
    const nearConnection = await connect(connectionConfig);

    const userWallet = await nearConnection.account(walletId);

    const newUserWallet = await createWallet(userId);

    if (newUserWallet == null) {
        throw new Error(`Error creating new wallet.`);
    }

    // Send NEAR tokens to another user
    const sendTokensResult = await userWallet.sendMoney(
        newUserWallet.walletId, // Receiver wallet ID
        utils.format.parseNearAmount(difference.toString()), // Amount being sent in yoctoNEAR
    );

    if ("SuccessValue" in sendTokensResult.status) return;
    
    throw new Error(`Error splitting wallet: ${sendTokensResult.transaction_outcome.outcome.status.FailureValue}`);
}

export function getWalletsForTransfer(wallets, targetAmount) {
    // Convert object to array of [wallet_id, balance] pairs and sort by balance (smallest to largest)
    let sortedWallets = wallets.sort((a, b) => a.amount - b.amount);
    let selectedWallets = [];
    let total = 0;

    for (let {wallet_id, amount} of sortedWallets) {
        if (total >= targetAmount) break; // Stop once we reach/exceed the target

        selectedWallets.push(wallet_id);
        total += parseFloat(amount);
    }

    return { wallets: selectedWallets, walletSum: total };
}

