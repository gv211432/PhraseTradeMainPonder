import { ganacheNftDb } from "../config/firebase_admin";

export const nftDbFiles = {
  deleteAll: async () => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.remove((error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data deleted successfully");
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
  updateHoldings: async (address: string, marketId: string, data: HoldingData) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child(`files/holdings/${address}/${marketId}`)
        .transaction((storedData: HoldingData) => {
          const shares = storedData && storedData.shares ? storedData.shares : "0";
          const newShares = BigInt(shares) + BigInt(data.shares);
          if (newShares == 0n) { return null; }
          return { shares: newShares.toString() };
        }).then(() => {
          resolve("Data updated successfully");
        }).catch((error) => {
          reject(error);
        });
    });
  },
  updateHolders: async (address: string, marketId: string, data: HoldersData) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child(`files/holders/${marketId}/${address}`)
        .transaction((storedData: HoldersData) => {
          const shares = storedData && storedData.shares ? storedData.shares : "0";
          const newShares = BigInt(shares) + BigInt(data.shares);
          if (newShares == 0n) { return null; }
          return { shares: newShares.toString() };
        }).then(() => {
          resolve("Data updated successfully");
        }).catch((error) => {
          reject(error);
        });
    });
  },
  get: async (nftId: string) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).once("value", (snapshot) => {
        resolve(snapshot.val());
      }).catch((error) => {
        reject(error);
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
      }).catch((error) => {
        reject(error);
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
      }).catch((error) => {
        reject(error);
      });
    });
  },
  setAttributes: async (nftId: string, data: any) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("files/minted").child(nftId).transaction((currentData) => {
        const ttv1 = currentData && currentData.ttv ? currentData.ttv : "0";
        const ttv2 = data && data.ttv ? data.ttv : "0";
        const ttv = (BigInt(ttv1) + BigInt(ttv2)).toString();
        return { ...currentData, ...data, ttv };
      }).then(() => {
        resolve("Data saved successfully");
      }).catch((error) => {
        reject(error);
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
        await ganacheNftDb.child(`files/minted/${marketId}`)
          .set({ ...data, ...extraData });

        // Step 3: Delete the data from the source path
        await sourceRef.remove();
      } else {
        console.log('No data found at the source path.');
      }
    } catch (error) {
      console.error('Error moving data:', error);
    }
  },
  removeSign: async (nftId: string) => {
    return new Promise((resolve, reject) => {
      ganacheNftDb.child("signs").child(nftId).remove((error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Sign removed successfully");
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};
