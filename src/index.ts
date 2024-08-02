import { ponder } from "@/generated";
import { ganacheMainDb, ganacheNftDb } from "./firebase_admin";
import { convertBigIntToString } from "./lib/basic";


const buySell = async (event: any) => {
  ganacheMainDb.child(`BuySell:MarketId/${event.args.marketId.toString()}/${event.block.timestamp.toString()}:${event.name}`)
    .set({ ...convertBigIntToString(event.args), type: event.name }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Data saved successfully");
      }
    });
};

ponder.on("PhraseTradeMain:BuyShare", async ({ event, context }) => {
  console.log({ event });
  await buySell(event);
});

ponder.on("PhraseTradeMain:SellShare", async ({ event, context }) => {
  console.log({ event });
  await buySell(event);
});

ponder.on("PhraseTradeNFT:Transfer", async ({ event, context }) => {
  console.log({ event });
  // ganacheNftDb.child("Transfer").set({
  //   [event.block.timestamp.toString()]: convertBigIntToString(event.args),
  // }, (error) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log("Data saved successfully");
  //   }
  // });
});