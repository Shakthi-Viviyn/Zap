import supabase from "./database/client.js";
import { getWallets, splitWallet, fetchWalletBalances, getWalletsForTransfer } from "./wallet.js";

export async function createTransaction(senderId, receiverId, targetAmount) {

    let walletIds = await getWallets(senderId);
    let { wallets: walletsWithAmount, totalAmount } = await fetchWalletBalances(walletIds);
    console.log(walletsWithBalance);

    if (totalAmount < targetAmount) {
        throw new Error(`Insufficient funds in user account.`);
    }

    let { wallets, walletSum } = getWalletsForTransfer(walletsWithAmount, targetAmount);
    let difference = walletSum - targetAmount;

    let transaction_info;
    if (difference > 0) {
        let walletToSplit = wallets.pop();
        console.log("Wallet to split: ", walletToSplit);
        transaction_info = {
            "walletToSplit": walletToSplit,
            "difference": difference,
            "wallets_data": wallets,
            "sender_user_id": senderId,
            "receiver_user_id": receiverId,
            "transaction_amount": targetAmount
        }
    }else{
        transaction_info = {
            "walletToSplit": "",
            "difference": difference,
            "wallets_data": wallets,
            "sender_user_id": senderId,
            "receiver_user_id": receiverId,
            "transaction_amount": targetAmount
        }
    }

    const {data, error} = await supabase.from("transaction").insert({transaction_info: transaction_info}).select("id");
    if (error) {
        throw new Error(`Error occured: ${error.message}`);
    }
    return data[0].id;
}

export async function commitTransaction(transactionId){

    let {data, error} = await supabase.from("transaction").select("*").eq("id", transactionId);
    if (error) {
        throw new Error(`Error fetching the transaction ${error.message}`);
    }

    let transaction_info = data[0].transaction_info;
    let walletToSplit = transaction_info.walletToSplit;
    let difference = transaction_info.difference;
    let walletIdsArray = transaction_info.wallets_data;
    let receiverUserId = transaction_info.receiver_user_id;

    if (walletToSplit != ""){
        await splitWallet(walletToSplit, difference);
        walletIdsArray.push(walletToSplit);
    }

    let { error: walletError } = await supabase.from("wallet").update({user_id: receiverUserId}).in("wallet_id", walletIdsArray);
    if (walletError) {
        throw new Error(`Error updating wallets: ${walletError.message}`);
    }
    return "Success";
}