import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";
import supabase from "./database/client";

dotenv.config();

const privateKey = process.env.ROOT_PRIVATE_KEY;
const accountId = process.env.ROOT_ACCOUNT_ID;
const myKeyStore = new keyStores.KeyStore();

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
 Pass in the userId as string
 Pass in the initial amount as number
*/
export async function createWallet(userId, initialAmount) {

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
        attachedDeposit: utils.format.parseNearAmount(initialAmount.toString()), // Initial balance for new account in yoctoNEAR
    });


    if (createAccountResult.status.SuccessValue) {
        const { error } = supabase.from("wallets").insert([
            {
                user_id: userId,
                wallet_id: newWalletId,
                public_key: newPublicKey,
                private_key: newPrivateKey,
                amount: initialAmount
            }
        ])
        .select('id');

        if (!error){
            return true;
        }
    }

    return false;
}

export async function getWallets(userId, limit = 10, offset = 0) {

    let result;
    if (limit == 0){
        result = await supabase.from("wallets")
        .select("*")
        .eq("user_id", userId)
        .limit(limit)
        .offset(offset);
    }else{
        result = await supabase.from("wallets")
        .select("*")
        .eq("user_id", userId)
    }
    
    if (result.error) {
        return null;
    } else {
        return result.data;
    }

}

