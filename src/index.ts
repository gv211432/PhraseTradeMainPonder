import { ponder } from "@/generated";
import { convertBigIntToString } from "./lib/basic";
import { ganacheMainDb } from "./config/firebase_admin";
import { nftDbFiles } from "./services/realtimeFileDb";
import { E18, getBuyPriceAfterFees, getPrice } from "./lib/price";


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
  const price = getPrice(event.args.newSupply, E18);
  if (event.args.qty.toString() === E18.toString() && event.args.newSupply.toString() === E18.toString()) {
    // new nft minted
    const data = {
      minted: true,
      mintedOn: event.block.timestamp.toString(),
      sharesSupply: event.args.newSupply.toString(),
      lastPricePaid: event.args.pricePaid.toString(),
      buyPrice: price.toString(),
      buyPriceAfterFees: getBuyPriceAfterFees(price).toString(),
    };
    await nftDbFiles.moveData(event.args.marketId.toString(), data);
  } else {
    await nftDbFiles.setAttributes(event.args.marketId.toString(), {
      sharesSupply: event.args.newSupply.toString(),
      lastPricePaid: event.args.pricePaid.toString(),
      buyPrice: price.toString(),
      buyPriceAfterFees: getBuyPriceAfterFees(price).toString(),
    });
  }
  await nftDbFiles.updateHoldings(event.args.buyer.toString(), event.args.marketId.toString(), {
    shares: event.args.qty.toString(),
  });
  await nftDbFiles.updateHolders(event.args.buyer.toString(), event.args.marketId.toString(), {
    shares: event.args.qty.toString(),
  });
  // log the buy event
  await buySell(event);
});

ponder.on("PhraseTradeMain:SellShare", async ({ event, context }) => {
  console.log({ event });
  const price = getPrice(event.args.newSupply, E18);
  await nftDbFiles.setAttributes(event.args.marketId.toString(), {
    sharesSupply: event.args.newSupply.toString(),
    buyPrice: price.toString(),
    buyPriceAfterFees: getBuyPriceAfterFees(price).toString(),
  });
  await nftDbFiles.updateHoldings(event.args.seller.toString(), event.args.marketId.toString(), {
    shares: "-" + event.args.qty.toString(),
  });
  await nftDbFiles.updateHolders(event.args.seller.toString(), event.args.marketId.toString(), {
    shares: "-" + event.args.qty.toString(),
  });
  // log the sell event
  await buySell(event);
});

ponder.on("PhraseTradeNFT:Transfer", async ({ event, context }) => {
  console.log({ event });
  await nftDbFiles.setAttributes(event.args.tokenId.toString(), {
    owner: event.args.to.toString(),
  });
});