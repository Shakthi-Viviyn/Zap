import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";
import supabase from "./database/client.js";

dotenv.config();

const privateKey = process.env.ROOT_PRIVATE_KEY;
const rootAccountId = process.env.ROOT_ACCOUNT_ID;
const myKeyStore = new keyStores.InMemoryKeyStore();

const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

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
const rootAccount = await nearConnection.account(rootAccountId);

/*
 Pass in the accountId as string
*/
export async function createWallet(accountId) {

    const newWalletId = Date.now() + ".testnet";

    const newKeyPair = KeyPair.fromRandom("ed25519");
    const newPublicKey = newKeyPair.getPublicKey().toString();
    const newPrivateKey = newKeyPair.toString();

    const createAccountResult = await rootAccount.functionCall({
        contractId: "testnet",
        methodName: "create_account",
        args: {
          new_account_id: newWalletId, // example-account.testnet
          new_public_key: newPublicKey, // ed25519:2ASWc...
        },
        attachedDeposit: utils.format.parseNearAmount("0.0"), // Initial empty balance for account in yoctoNEAR
    });
    
    if (createAccountResult.status.SuccessValue) {
        const { data, error } = await supabase.from("wallet").insert(
            {
                account_id: accountId,
                private_key: newPrivateKey,
                public_key: newPublicKey,
                wallet_id: newWalletId
            }
        )

        if (error){
            throw new Error(`Error creating wallet: ${error.message}`);
        }
        return {
            account_id: accountId,
            wallet_id: newWalletId,
            private_key: newPrivateKey,
            public_key: newPublicKey
        };
    }
    return null;
}

export async function getWallets(accountId, limit = 10, offset = 0) {

    let { error, data} = await supabase.from("wallet")
    .select("wallet_id, amount")
    .eq("account_id", accountId)

    if (error){
        throw new Error(`Error getting wallets: ${error.message}`);
    }
    return data;
}

/* returns balance of a single wallet as a float number */
export async function getWalletBalanceFromChain(walletId) {
    const wallet = await storeLessConnection.account(walletId);
    const { total } = await wallet.getAccountBalance();
    return parseFloat(total);
}

/* returns the new total balance after syncing blockchain balances of all wallets belonging to user down to the DB */
export async function refreshAllWallets(accountId){
    const wallets = await getWallets(accountId);
    let newBalance = 0;
    await Promise.all(wallets.map(async (wallet) => {
            const balance = await getWalletBalanceFromChain(wallet.wallet_id);
            const { error } =  await supabase.from("wallet").update({ amount: balance }).eq("wallet_id", wallet.wallet_id);
            if (error) {
                throw new Error(`Error updating wallet: ${error.message}`);
            }
            newBalance += balance;
        }
    ));
    const { error } = await supabase.from("account").update({ total_amount: newBalance }).eq("id", accountId);
    if (error) {
        throw new Error(`Error updating account: ${error.message}`);
    }
    return newBalance;
}

export async function splitWallet(walletId, difference) {

    const { data, error } = await supabase.from("wallet").select("*").eq("wallet_id", walletId);

    if (error) {
        throw new Error(`Error splitting wallet: ${error.message}`);
    }

    const wallet = data[0];
    const userAccountId = wallet.account_id;
    const newAmount = wallet.amount - difference;

    const keyPair = KeyPair.fromString(wallet.private_key);
    await myKeyStore.setKey("testnet", walletId, keyPair);

    // Create a connection to the NEAR testnet
    const nearConnection = await connect(connectionConfig);

    const userWallet = await nearConnection.account(walletId);
    const newUserWallet = await createWallet(userAccountId);

    if (newUserWallet == null) {
        throw new Error(`Error creating new wallet.`);
    }

    // Send NEAR tokens to another account
    const sendTokensResult = await userWallet.sendMoney(
        newUserWallet.wallet_id, // Receiver account
        utils.format.parseNearAmount(difference.toString()), // Amount being sent in yoctoNEAR
    );

    if (sendTokensResult.transaction_outcome.outcome.status.SuccessValue) {
        await supabase.from("wallet").update({ amount: newAmount }).eq("wallet_id", walletId);
        await supabase.from("wallet").insert(
            {
                account_id: userAccountId,
                private_key: newUserWallet.private_key,
                public_key: newUserWallet.public_key,
                wallet_id: newUserWallet.wallet_id,
                amount: difference
            }
        );
        if (error) {
            throw new Error(`Error splitting wallet: ${error.message}`);
        }
        return "Success";
    }
    throw new Error(`Error splitting wallet: ${sendTokensResult.transaction_outcome.outcome.status.FailureValue}`);
}

