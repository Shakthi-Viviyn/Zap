import * as nearAPI from "near-api-js";

const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
};
const near = await connect(connectionConfig);
const { keyStores } = nearAPI;
const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

export default { near, myKeyStore};





