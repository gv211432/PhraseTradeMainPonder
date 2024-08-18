import { ganacheNftDb } from "../config/firebase_admin";

export const nftDbFiles = {
  updateHoldings: async (address: string, marketId: string, data: HoldingData) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child(`files/holdings/${address}/${marketId}`).once("value", (snapshot) => {
        const storedData: HoldingData = snapshot.val();
        const shares = storedData && storedData.shares ? storedData.shares : "0";
        const newShares = BigInt(shares) + BigInt(data.shares);
        ganacheNftDb.child(`files/holdings/${address}/${marketId}`)
          .set({ shares: newShares.toString() }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("Data updated successfully");
            }
          });
      });
    });
  },
  updateHolders: async (address: string, marketId: string, data: HoldersData) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child(`files/holders/${marketId}/${address}`).once("value", (snapshot) => {
        const storedData: HoldersData = snapshot.val();
        const shares = storedData && storedData.shares ? storedData.shares : "0";
        const newShares = BigInt(shares) + BigInt(data.shares);
        ganacheNftDb.child(`files/holders/${marketId}/${address}`)
          .set({ shares: newShares.toString() }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("Data updated successfully");
            }
          });
      });
    });
  },
  get: async (nftId: string) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).once("value", (snapshot) => {
        resolve(snapshot.val());
      });
    });
  },
  set: async (nftId: string, data: any) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).set(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data saved successfully");
        }
      });
    });
  },
  setAttribute: async (nftId: string, attribute: string, data: any) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).child(attribute).set(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data saved successfully");
        }
      });
    });
  },
  setAttributes: async (nftId: string, data: any) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).update(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data saved successfully");
        }
      });
    });
  },
  // Function to move data from one path to another
  moveData: async (marketId: string, extraData: any) => {
    try {
      const sourceRef = ganacheNftDb.child(`files/unminted/${marketId}`);
      // Step 1: Read the data from the source path
      const snapshot = await sourceRef.once('value');
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Step 2: Write the data to the destination path
        await ganacheNftDb.child(`files/minted/${marketId}`).set({ ...data, ...extraData });

        // Step 3: Delete the data from the source path
        await sourceRef.remove();

        console.log('Data moved successfully!');
      } else {
        console.log('No data found at the source path.');
      }
    } catch (error) {
      console.error('Error moving data:', error);
    }
  }
};