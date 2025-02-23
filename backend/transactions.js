import { splitWallet } from "./wallet";
import supabase from "./database/client";

export async function commitTransaction(transactionId){

    let {data, error} = await supabase.from("transaction").select("*").eq("transaction_id", transactionId);
    if (error) {
        throw new Error(`Error fetching the transaction ${error.message}`);
    }

    let transaction_info = data[0].transaction_info;
    let walletToSplit = transaction_info.walletToSplit;
    let difference = transaction_info.difference;
    let walletIdsArray = transaction_info.wallets_data;
    let receiverUserId = transaction_info.receiver_user_id;
    let senderUserId = transaction_info.sender_user_id;
    let transactionAmount = transaction_info.transaction_amount;

    let result = await splitWallet(walletToSplit, difference);
    if (result == "Success") {
        let { error } = await supabase.from("wallet").update({user_id: receiverUserId}).in("wallet_id", walletIdsArray);
        if (error) {
            throw new Error(`Error updating wallets: ${updateError.message}`);
        }
        // update sender user to subtract total amount to reflect the transaction
        let { error: senderError } = await supabase.from("user").update({total_amount: supabase.raw(`transaction_amount - ${transactionAmount}`)}).eq("id", senderUserId);
        if (senderError) {
            throw new Error(`Error updating sender user: ${senderError.message}`);
        }
        // update receiver user to add total amount to reflect the transaction
        let { error: receiverError } = await supabase.from("user").update({total_amount: supabase.raw(`transaction_amount + ${transactionAmount}`)}).eq("id", receiverUserId);
        if (receiverError) {
            throw new Error(`Error updating receiver user: ${receiverError.message}`);
        }
        return "Success";
    }
}