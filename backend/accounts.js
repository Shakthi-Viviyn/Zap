import supabase from "./database/client.js";
import { getWallets, splitWallet } from "./wallet.js";
/*
    Pass userId as number
*/
export async function getAccount(userId){
    const { data, error } = await supabase.from("account").select("*").eq("user_id", userId).limit(1);
    if (error) {
        return null;
    } else {
        return data[0];
    }
}

export async function createAccount({ firstname, lastname, username, email, password }) {
    const {data, error} = await supabase.from("account").insert(
        {
            first_name: firstname,
            last_name: lastname,
            username: username,
            email: email,
            password: password
        }
    ).select("id");

    if (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
    return data[0];
}

export async function determineTransferDistribution(senderId, targetAmount) {
    const currAmount = getAmount(senderId);
    if (currAmount < targetAmount) {
        throw new Error(`Insufficient funds in account.`);
    }

    let wallet_data = await getWallets(senderId, 0);
    let {wallets, walletSum} = get_wallets_for_transfer(wallet_data, targetAmount);
    let difference = walletSum - targetAmount;

    let walletToSplit = wallets.pop();
    let transaction_info = {
        "walletToSplit": walletToSplit,
        "difference": difference,
        "wallets_data": wallets
    }

    const {data, error} = await supabase.from("transaction").insert({transaction_info: transaction_info}).select("id");
    if (error) {
        throw new Error(`Error occured: ${error.message}`);
    }
    return data[0];
}

async function getAmount(senderId) {
    const {data, error} = await supabase.from("account").select("total_amount").eq("id", senderId);
    if (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
    return data[0];
}

function get_wallets_for_transfer(wallets, targetAmount) {
    // Convert object to array of [account_id, balance] pairs and sort by balance (smallest to largest)
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



// function get_accounts_for_transfer(accounts_data, target_amount) {
//     let accountEntries = Object.entries(accounts_data); // Convert object to array of [account_id, balance]
    
//     let dp = new Array(target_amount + 1).fill(Infinity); // Min accounts needed to reach sum i
//     dp[0] = 0; // Base case: 0 accounts needed for sum 0

//     let usedAccounts = new Array(target_amount + 1).fill(null); // Track account IDs used
//     usedAccounts[0] = []; 

//     for (let [accountId, balance] of accountEntries) {
//         for (let j = target_amount; j >= balance; j--) { // Reverse to ensure each account is used at most once
//             if (dp[j - balance] + 1 < dp[j]) {
//                 dp[j] = dp[j - balance] + 1;
//                 usedAccounts[j] = [...usedAccounts[j - balance], accountId];
//             }
//         }
//     }

//     return usedAccounts[target] || []; // Return the list of account IDs
// }

