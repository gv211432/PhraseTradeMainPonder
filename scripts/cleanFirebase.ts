import { nftDbFiles } from "../src/services/realtimeFileDb";
import { mainActivityDb } from "../src/services/realtimeMainDb";

const deleteFirebaseData = async () => {
  await mainActivityDb.deleteAll();
  await nftDbFiles.deleteAll();
};

console.log("Hello Bro");