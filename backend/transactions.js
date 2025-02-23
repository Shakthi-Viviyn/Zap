import { splitWallet } from "./wallet";
import supabase from "./database/client";

export async function commitTransaction(transactionId){

    let {data, error} = await supabase.from("transaction").select("*").eq("transaction_id", transactionId);
    if (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }

    let transaction_info = data[0].transaction_info;
    let walletToSplit = transaction_info.walletToSplit;
    let difference = transaction_info.difference;
    let walletIdsArray = transaction_info.wallets_data;
    let receiverAccountId = transaction_info.receiver_account_id;
    let senderAccountId = transaction_info.sender_account_id;
    let transactionAmount = transaction_info.transaction_amount;

    let result = await splitWallet(walletToSplit, difference);
    if (result == "Success") {
        let { error } = await supabase.from("wallet").update({account_id: receiverAccountId}).in("wallet_id", walletIdsArray);
        if (updateError) {
            throw new Error(`Error updating wallets: ${updateError.message}`);
        }
        // update sender account to subtract total amount to reflect the transaction
        let { error: senderError } = await supabase.from("account").update({total_amount: supabase.raw(`transaction_amount - ${transactionAmount}`)}).eq("id", senderAccountId);
        if (senderError) {
            throw new Error(`Error updating sender account: ${senderError.message}`);
        }
        // update receiver account to add total amount to reflect the transaction
        let { error: receiverError } = await supabase.from("account").update({total_amount: supabase.raw(`transaction_amount + ${transactionAmount}`)}).eq("id", receiverAccountId);
        if (receiverError) {
            throw new Error(`Error updating receiver account: ${receiverError.message}`);
        }
        return "Success";
    }
}