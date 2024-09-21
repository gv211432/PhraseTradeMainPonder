import { createSchema } from "@ponder/core";


export default createSchema((p) => ({
  // These events will update this table => BuyShare, SellShare
  Account: p.createTable({
    id: p.string(), // address
    ownedMarkets: p.many("Market.ownerId"), // markets owned by the account
    trades: p.many("Trade.buyerId"),
    creatorFees: p.many("ClaimedCreatorFee.creatorId"),
    ownerFees: p.many("ClaimedOwnerFee.beneficiaryId"),
    reflectionFees: p.many("ClaimedReflectionFee.beneficiaryId"),
    rewards: p.many("ClaimedReward.beneficiaryId"),
    transferEvents: p.many("OwnershipTransferred.newOwnerId"),
    nftApprovals: p.many("Approval.owner"),
    nftTransferFromEvents: p.many("TransferEvent.fromId"),
    nftTransferToEvents: p.many("TransferEvent.toId"),
  }),
  Market: p.createTable({
    id: p.bigint(),
    ownerId: p.string().references("Account.id"),
    trades: p.many("Trade.marketId"),
    bonuses: p.many("BonusAdded.marketId"),
    rewards: p.many("RewardsOffered.marketId"),
  }),
  Trade: p.createTable({
    id: p.string(),
    marketId: p.bigint().references("Market.id"),
    buyerId: p.string().references("Account.id").optional(),
    sellerId: p.string().references("Account.id").optional(),
    qty: p.bigint(),
    pricePaid: p.bigint().optional(),
    protocolFee: p.bigint(),
    ownerFee: p.bigint(),
    creatorFee: p.bigint(),
    rewardFee: p.bigint(),
    reflectionFee: p.bigint(),
    newSupply: p.bigint(),
    dividendsAdded: p.bigint().optional(),
    rewardsAdded: p.bigint().optional(),
    priceReceived: p.bigint().optional(),
    buyer: p.one("buyerId"),
    seller: p.one("sellerId"),
    market: p.one("marketId"),
  }),
  BonusAdded: p.createTable({
    id: p.string(),
    amount: p.bigint(),
    marketId: p.bigint().references("Market.id"),
  }),
  ClaimedCreatorFee: p.createTable({
    id: p.string(), // event id
    creatorId: p.string().references("Account.id"),
    beneficiaryId: p.string().references("Account.id"),
    claimedFees: p.bigint(),
  }),
  ClaimedOwnerFee: p.createTable({
    id: p.string(),
    beneficiaryId: p.string().references("Account.id"),
    claimedFees: p.bigint(),
  }),
  ClaimedReflectionFee: p.createTable({
    id: p.string(),
    marketId: p.bigint().references("Market.id"),
    beneficiaryId: p.string().references("Account.id"),
    claimedFees: p.bigint(),
    market: p.one("marketId"),
    beneficiary: p.one("beneficiaryId"),
  }),
  ClaimedReward: p.createTable({
    id: p.string(),
    marketId: p.bigint().references("Market.id"),
    beneficiaryId: p.string().references("Account.id"),
    claimedRewards: p.bigint(),
    market: p.one("marketId"),
    beneficiary: p.one("beneficiaryId"),
  }),
  // abouth the contracts ownership => PhraseTradeMain, PhraseTradeNFT
  OwnershipTransferred: p.createTable({
    id: p.string(),
    previousOwnerId: p.string().references("Account.id"),
    newOwnerId: p.string().references("Account.id"),
    previousOwner: p.one("previousOwnerId"),
    newOwner: p.one("newOwnerId"),
  }),
  RewardsOffered: p.createTable({
    id: p.string(),
    marketId: p.bigint().references("Market.id"),
    amount: p.bigint(),
    pendingRewardsInHand: p.bigint(),
  }),
  Approval: p.createTable({
    id: p.string(),
    owner: p.string().references("Account.id"),
    approved: p.string().references("Account.id"),
    tokenId: p.bigint(),
    ownerId: p.one("owner"),
  }),
  ApprovalForAll: p.createTable({
    id: p.string(),
    owner: p.string().references("Account.id"),
    operator: p.string().references("Account.id"),
    approved: p.boolean(),
  }),
  BatchMetadataUpdate: p.createTable({
    id: p.string(),
    fromTokenId: p.bigint(),
    toTokenId: p.bigint(),
  }),
  MetadataUpdate: p.createTable({
    id: p.string(),
    tokenId: p.bigint(),
  }),
  TransferEvent: p.createTable({
    id: p.string(),
    fromId: p.string().references("Account.id"),
    toId: p.string().references("Account.id"),
    tokenId: p.bigint(),
  }),
}));

