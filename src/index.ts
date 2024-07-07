import { ponder } from "@/generated";

ponder.on("PhraseTradeMain:BuyShare", async (event) => {
  console.log({ event });
});

ponder.on("PhraseTradeMain:SellShare", async (event) => {
  console.log({ event });
});

ponder.on("PhraseTradeNFT:Transfer", async (event) => {
  console.log({ event });
});