import supabase from "./database/client.js";
import { getWallets, splitWallet } from "./wallet.js";
/*
    Pass userId as number
*/
export async function getUser(userId){
    const { data, error } = await supabase.from("user").select("*").eq("user_id", userId).limit(1);
    if (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
    return data[0];
}

export async function getUserByUsername(username){
    const { data, error } = await supabase.from("user").select("id, username").eq("username", username).limit(1);
    if (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
    return data[0];
}

export async function createUser(username, password) {
    const {data, error} = await supabase.from("user").insert(
        {
            username: username,
            password: password
        }
    ).select("id");

    if (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
    return data.id;
}

export async function determineTransferDistribution(senderId, receiverId, targetAmount) {
    const currAmount = await getAmount(senderId);
    if (currAmount < targetAmount) {
        throw new Error(`Insufficient funds in user account.`);
    }

    let wallet_data = await getWallets(senderId, 0);
    let {wallets, walletSum} = getWalletsForTransfer(wallet_data, targetAmount);
    let difference = walletSum - targetAmount;

    let walletToSplit = wallets.pop();
    let transaction_info = {
        "walletToSplit": walletToSplit,
        "difference": difference,
        "wallets_data": wallets,
        "sender_user_id": senderId,
        "receiver_user_id": receiverId,
        "transaction_amount": targetAmount
    }

    const {data, error} = await supabase.from("transaction").insert({transaction_info: transaction_info}).select("id");
    if (error) {
        throw new Error(`Error occured: ${error.message}`);
    }
    return data[0].id;
}

async function getAmount(senderId) {
    const {data, error} = await supabase.from("user").select("total_amount").eq("id", senderId);
    if (error) {
        throw new Error(`Error getting total amount: ${error.message}`);
    }
    return data[0];
}

export async function getUserId(username) {
    const {data, error} = await supabase.from("user").select("id").eq("username", username);
    if (error) {
        throw new Error(`Error getting user Id: ${error.message}`);
    }
    return data[0];
}

function getWalletsForTransfer(wallets, targetAmount) {
    // Convert object to array of [wallet_id, balance] pairs and sort by balance (smallest to largest)
    let sortedWallets = wallets.sort((a, b) => a.amount - b.amount);
    let selectedWallets = [];
    let total = 0;

    for (let {wallet_id, amount} of sortedWallets) {
        if (total >= targetAmount) break; // Stop once we reach/exceed the target

        selectedWallets.push(wallet_id);
        total += amount;
    }

    return { wallets: selectedWallets, walletSum: total };
}

