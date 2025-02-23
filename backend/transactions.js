import supabase from "./database/client.js";
import { getWallets, splitWallet, fetchWalletBalances, getWalletsForTransfer } from "./wallet.js";

export async function createTransaction(senderId, receiverId, targetAmount) {

    let wallets = await getWallets(senderId);
    let totalAmount;
    ({ wallets, totalAmount } = await fetchWalletBalances(wallets));

    if (totalAmount < targetAmount) {
        throw new Error(`Insufficient funds in user account.`);
    }

    let walletSum;
    ({ wallets, walletSum } = getWalletsForTransfer(wallets, targetAmount));
    let difference = walletSum - targetAmount;

    let transaction_info;
    let willPayFee = false;
    if (difference > 0) {
        let walletToSplit = wallets.pop();
        transaction_info = {
            "walletToSplit": walletToSplit,
            "difference": difference,
            "wallets_data": wallets,
            "sender_user_id": senderId,
            "receiver_user_id": receiverId,
            "transaction_amount": targetAmount
        }
        willPayFee = true;
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
    return {
        "will_pay_fee": willPayFee,
        "transaction_id": data[0].id
    }
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

    console.log(walletToSplit, difference, walletIdsArray, receiverUserId);

    if (walletToSplit != ""){
        await splitWallet(walletToSplit, difference);
        walletIdsArray.push(walletToSplit);
    }

    let { error: walletError } = await supabase.from("wallet").update({user_id: receiverUserId}).in("wallet_id", walletIdsArray);
    if (walletError) {
        throw new Error(`Error updating wallets: ${walletError.message}`);
    }
}