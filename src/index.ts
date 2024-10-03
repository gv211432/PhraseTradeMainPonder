import { ponder, } from "@/generated";
import { convertBigIntToString } from "./lib/basic";
import { ganacheMainDb } from "./config/firebase_admin";
import { nftDbFiles } from "./services/realtimeFileDb";
import { E18, getBuyPriceAfterFees, getPrice } from "./lib/price";
import { mainActivityDb } from "./services/realtimeMainDb";
import { eventPreProcess } from "./hooks/eventPreProcess";
import { eventPostProcess } from "./hooks/eventPostProcess";
import { getUserDbConnection } from "./lib/sqlRunner";

// Need to optimize and save only relevant data
const buySell = async (event: any) => {
  ganacheMainDb.child(`BuySell:MarketId/${event.args.marketId.toString()}/${event.block.timestamp.toString()}:${event.name}`)
    .set({ ...convertBigIntToString(event.args), type: event.name }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Data saved successfully");
      }
    }).catch((error) => {
      console.error(error);
    });

  if (event.args.buyer || event.args.seller) {
    const user = event.args.buyer || event.args.seller;
    mainActivityDb.set(`${user.toString()}/${event.block.timestamp.toString()}:${event.name}`, {
      marketId: event.args.marketId.toString(),
      qty: event.args.qty.toString(),
      type: event.name,
      doneAt: event.block.timestamp.toString(),
    }).catch((error) => {
      console.error(error);
    });
  }
};


ponder.on("PhraseTradeMain:BuyShare", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event

  console.log({ event });
  const { db } = context;

  // if the account does not exist, create it
  await db.Account.upsert({
    id: event.args.buyer.toString()
  });

  if (event.args.qty.toString() === E18.toString() && event.args.newSupply.toString() === E18.toString()) {
    // new nft minted, create the market or update the owner(if it exists)
    await db.Market.upsert({
      id: event.args.marketId,
      create: {
        ownerId: event.args.buyer.toString(),
      },
      update: {},
    });
    // Update the NFT record, minted true, in user db for included in the search results.
    (await getUserDbConnection())?.runQuery(`UPDATE nfts SET minted=true WHERE "marketId"='${event.args.marketId}'`);
  }

  // create the trade record
  await db.Trade.create({
    id: event.transaction.hash,
    data: {
      marketId: event.args.marketId,
      buyerId: event.args.buyer.toString(),
      qty: event.args.qty,
      pricePaid: event.args.pricePaid,
      protocolFee: event.args.protocolFee,
      ownerFee: event.args.ownerFee,
      creatorFee: event.args.creatorFee,
      rewardFee: event.args.rewardFee,
      reflectionFee: event.args.reflectionFee,
      newSupply: event.args.newSupply,
    },
  });

  const price = getPrice(event.args.newSupply, E18);
  if (event.args.qty.toString() === E18.toString() && event.args.newSupply.toString() === E18.toString()) {
    // new nft minted
    const data = {
      minted: true,
      mintedOn: event.block.timestamp.toString(),
      sharesSupply: event.args.newSupply.toString(),
      lastPricePaid: event.args.pricePaid.toString(),
      ttv: event.args.pricePaid.toString(),
      buyPrice: price.toString(),
      buyPriceAfterFees: getBuyPriceAfterFees(price).toString(),
    };
    await nftDbFiles.moveData(event.args.marketId.toString(), data);
    await nftDbFiles.removeSign(event.args.marketId.toString());
  } else {
    await nftDbFiles.setAttributes(event.args.marketId.toString(), {
      sharesSupply: event.args.newSupply.toString(),
      lastPricePaid: event.args.pricePaid.toString(),
      ttv: event.args.pricePaid.toString(),
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

  eventPostProcess(event, context);
});

ponder.on("PhraseTradeMain:SellShare", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event

  console.log({ event });
  const { db } = context;

  // add a trade record
  await db.Trade.create({
    id: event.transaction.hash,
    data: {
      marketId: event.args.marketId,
      sellerId: event.args.seller.toString(),
      qty: event.args.qty,
      protocolFee: event.args.protocolFee,
      ownerFee: event.args.ownerFee,
      creatorFee: event.args.creatorFee,
      rewardFee: event.args.rewardFee,
      reflectionFee: event.args.reflectionFee,
      newSupply: event.args.newSupply,
      dividendsAdded: event.args.dividendsAdded,
      rewardsAdded: event.args.rewardsAdded,
      priceReceived: event.args.priceReceived,
    },
  });

  const price = getPrice(event.args.newSupply, E18);
  await nftDbFiles.setAttributes(event.args.marketId.toString(), {
    sharesSupply: event.args.newSupply.toString(),
    ttv: event.args.priceReceived.toString(),
    buyPrice: price.toString(),
    buyPriceAfterFees: getBuyPriceAfterFees(price).toString(),
  });
  await nftDbFiles.updateHoldings(event.args.seller.toString(), event.args.marketId.toString(), {
    shares: `-${event.args.qty.toString()}`,
  });
  await nftDbFiles.updateHolders(event.args.seller.toString(), event.args.marketId.toString(), {
    shares: `-${event.args.qty.toString()}`,
  });
  // log the sell event
  await buySell(event);

  eventPostProcess(event, context);
});

// Update the new owner of the NFT
ponder.on("PhraseTradeNFT:Transfer", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event


  console.log({ event });
  const { db } = context;

  // transfer event record
  await db.TransferEvent.create({
    id: event.transaction.hash,
    data: {
      tokenId: event.args.tokenId,
      fromId: event.args.from,
      toId: event.args.to,
    }
  });

  // update the owner of the NFT
  await nftDbFiles.setAttributes(event.args.tokenId.toString(), {
    owner: event.args.to.toString(),
  });

  eventPostProcess(event, context);
});

// Will never be used for now
ponder.on("PhraseTradeMain:BonusAdded", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event

  const { db } = context;

  // add the bonus record
  await db.BonusAdded.create({
    id: event.transaction.hash,
    data: {
      amount: event.args.amount,
      marketId: event.args.marketId,
    }
  });

  event.block.timestamp += 1n;
  await buySell(event);

  eventPostProcess(event, context);
});

ponder.on("PhraseTradeMain:RewardsOffered", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event

  const { db } = context;

  // add the rewards record
  await db.RewardsOffered.create({
    id: event.transaction.hash,
    data: {
      amount: event.args.amount,
      pendingRewardsInHand: event.args.pendingRewardsInHand,
      marketId: event.args.marketId,
    }
  });

  await buySell(event);

  eventPostProcess(event, context);
});


ponder.on("PhraseTradeMain:ClaimedCreatorFee", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event


  const log = event.args;
  const { db } = context;

  // create a claim record
  await db.ClaimedCreatorFee.create({
    id: event.transaction.hash,
    data: {
      creatorId: log.sender.toString(),
      beneficiaryId: log.beneficiary.toString(),
      claimedFees: log.claimedFees,
    }
  });

  await mainActivityDb.set(`${log.sender.toString()}/${Date.now()}:${event.name}`, {
    fee: log.claimedFees.toString(),
    doneAt: event.block.timestamp.toString(),
    type: event.name,
  });

  eventPostProcess(event, context);
});

ponder.on("PhraseTradeMain:ClaimedOwnerFee", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event


  const log = event.args;
  const { db } = context;

  // create a claim record
  await db.ClaimedOwnerFee.create({
    id: event.transaction.hash,
    data: {
      beneficiaryId: log.beneficiary.toString(),
      claimedFees: log.claimedFees,
    }
  });

  await mainActivityDb.set(`${log.sender.toString()}/${Date.now()}:${event.name}`, {
    fee: log.claimedFees.toString(),
    doneAt: event.block.timestamp.toString(),
    type: event.name,
  });

  eventPostProcess(event, context);
});

ponder.on("PhraseTradeMain:ClaimedReward", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event


  const log = event.args;
  const { db } = context;

  // create a claim record
  await db.ClaimedReward.create({
    id: event.transaction.hash,
    data: {
      marketId: log.marketId,
      beneficiaryId: log.beneficiary.toString(),
      claimedRewards: log.claimedRewards,
    }
  });

  await mainActivityDb.set(`${log.sender.toString()}/${Date.now()}:${event.name}`, {
    marketId: log.marketId.toString(),
    reward: log.claimedRewards.toString(),
    doneAt: event.block.timestamp.toString(),
    type: event.name,
  });

  eventPostProcess(event, context);
});

//  Add the new record to the main activity db
ponder.on("PhraseTradeMain:ClaimedReflectionFee", async ({ event, context }) => {
  const direction = await eventPreProcess(event, context);
  if (direction.skip) return; // skip the event


  const log = event.args;
  const { db } = context;

  // create a claim record
  await db.ClaimedReflectionFee.create({
    id: event.transaction.hash,
    data: {
      marketId: log.marketIds,
      beneficiaryId: log.beneficiary.toString(),
      claimedFees: log.claimedFees,
    }
  });

  await mainActivityDb.set(`${log.sender.toString()}/${Date.now()}:${event.name}`, {
    fee: log.claimedFees.toString(),
    marketId: log.marketIds.toString(),
    doneAt: event.block.timestamp.toString(),
    type: event.name,
  });

  eventPostProcess(event, context);
});
