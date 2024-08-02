import * as admin from "firebase-admin";

// Fetch the service account key JSON file contents
import { serviceAccount } from "../firebase_key";

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  // The database URL depends on the location of the database
  databaseURL: "https://phrasetradedev-default-rtdb.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
export const realtimeDb = admin.database();

export const ganacheMainDb = realtimeDb.ref("1337/v1/PhraseTradeMain");
export const ganacheNftDb = realtimeDb.ref("1337/v1/PhraseTradeNFT");
export const ganacheConfigDb = realtimeDb.ref("1337/v1/config");

// ganacheDb.once("value", function (snapshot: any) {
//   console.log(snapshot.val());
// });