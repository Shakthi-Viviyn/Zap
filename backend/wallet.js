import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";
import supabase from "./database/client.js";

dotenv.config();

const privateKey = process.env.ROOT_PRIVATE_KEY;
const accountId = process.env.ROOT_ACCOUNT_ID;
const myKeyStore = new keyStores.InMemoryKeyStore();

const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
};

const nearConnection = await connect(connectionConfig);
const rootAccount = await nearConnection.account(accountId);

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
        .select('wallet_id');

        if (error){
            throw new Error(`Error creating wallet: ${error.message}`);
        }
        return data[0];
    }
}

export async function getWallets(accountId, limit = 10, offset = 0) {

    let result;
    if (limit != 0){
        result = await supabase.from("wallet")
        .select({wallet_id, amount})
        .eq("account_id", accountId)
        .limit(limit)
        .offset(offset);
    } else {
        result = await supabase.from("wallet")
        .select({wallet_id, amount})
        .eq("account_id", accountId)
    }
    
    if (result.error) {
        return null;
    } else {
        return result.data;
    }

}

export async function splitWallet(walletId, difference) {
    
}

