import { splitWallet } from "./wallet.js";
import supabase from "./database/client.js";

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