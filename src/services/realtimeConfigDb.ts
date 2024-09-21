import { ganacheConfigDb } from "../config/firebase_admin";

export const cofigDb = {
  setIndexedBlockNumber: async (blockNum: number, logNumber: number) => {
    return new Promise<string>((resolve, reject) => {
      ganacheConfigDb.child(`indexingSync`).set({
        indexedBlockNumber: blockNum.toString(),
        indexedLogNumber: logNumber.toString()
      }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data saved successfully");
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
  getIndexedBlockNumber: async () => {
    return new Promise<{ indexedBlockNumber: string, indexedLogNumber: string; }>((resolve, reject) => {
      ganacheConfigDb.child(`indexingSync`).once("value", (snapshot) => {
        if (!snapshot.exists()) {
          // incase the data does not exist, set the default value
          cofigDb.setIndexedBlockNumber(0, 0);
          resolve({ indexedBlockNumber: "0", indexedLogNumber: "0" });
        }
        resolve(snapshot.val());
      }).catch((error) => {
        reject(error);
      });
    });
  }
};