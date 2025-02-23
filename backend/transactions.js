

async function commitTransaction(transactionId){

    const {data, error} = await supabase.from("transaction").select("*").eq("transaction_id", transactionId);
    if (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
    return data[0];
}