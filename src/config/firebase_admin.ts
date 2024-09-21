import * as admin from "firebase-admin";
import { serviceAccount } from "./firebase_key";
// import { envs } from "../../loadEnv";

// Fetch the service account key JSON file contents
// const chainId = envs.CHAIN_ID;
// const version = "v" + envs.VERSION;
const chainId = "1337";
const version = "v1";

if (!chainId || !version) {
  throw new Error("Chain Id and Version are required");
}

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  // The database URL depends on the location of the database
  databaseURL: "https://phrasetradedev-default-rtdb.firebaseio.com",
  storageBucket: "gs://phrasetradedev.appspot.com",
});

/** As an admin, the app has access to read and write all data, regardless of Security Rules */
export const realtimeDb = admin.database();
export const firebaseAuth = admin.auth();

export const ganacheMainDb = realtimeDb.ref(`${chainId}/${version}/PhraseTradeMain`);
export const ganacheNftDb = realtimeDb.ref(`${chainId}/${version}/PhraseTradeNFT`);
export const ganacheConfigDb = realtimeDb.ref(`${chainId}/${version}/config`);
export const ganacheUser = realtimeDb.ref(`${chainId}/${version}/users`);
export const ganacheUserPublic = realtimeDb.ref(`${chainId}/${version}/usersPublic`);

/** Firebase Storage Bucket */
export const bucket = admin.storage().bucket();
