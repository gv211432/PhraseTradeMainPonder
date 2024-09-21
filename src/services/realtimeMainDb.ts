import { ganacheMainDb } from "../config/firebase_admin";

export const mainActivityDb = {
  deleteAll: async () => {
    return new Promise((resolve, reject) => {
      ganacheMainDb.remove((error) => {
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
  set: async (userAddr: string, data: any) => {
    return new Promise((resolve, reject) => {
      ganacheMainDb.child(`activity/${userAddr}`).set(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("Data saved successfully");
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};