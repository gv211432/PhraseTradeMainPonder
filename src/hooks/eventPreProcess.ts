import { cofigDb } from "../services/realtimeConfigDb";

const TRACKER: {
  blockNumber: number | null;
  eventIndex: number | null;
} = { blockNumber: null, eventIndex: null };

export const eventPreProcess = async (event: any, context: any): Promise<{ skip: boolean; }> => {

  // block numbers are incremental and every block has incremental log index
  // utilize this to track the last processed block and log index
  const blockNumber = Number(event.block.number);
  const logIndex = Number(event.log.logIndex);

  console.log({ blockNumber, logIndex });

  if (TRACKER.blockNumber === null || TRACKER.eventIndex === null) {
    // this is used once on restarts to initialize the tracker
    const done = await cofigDb.getIndexedBlockNumber();
    if (done) {
      TRACKER.blockNumber = parseInt(done.indexedBlockNumber);
      TRACKER.eventIndex = parseInt(done.indexedLogNumber);
    } else {
      return { skip: true };
    }
  }

  // if the block number is less than the last processed block number, skip
  if (blockNumber < TRACKER.blockNumber) {
    return { skip: true };
  }
  // if the block number is the same as the last processed block number but the log index is less, skip
  if (blockNumber === TRACKER.blockNumber && logIndex <= TRACKER.eventIndex) {
    return { skip: true };
  }

  // finally update the tracker
  TRACKER.blockNumber = blockNumber;
  TRACKER.eventIndex = logIndex;
  // also update the last processed block number and log index on the database
  await cofigDb.setIndexedBlockNumber(blockNumber, logIndex);

  // fallback to process the event
  return { skip: false };
};