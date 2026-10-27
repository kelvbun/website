/**
 * @typedef {[number, number]} PixelEntry
 * @param {Map<number, number>} pending
 * @param {(batch: PixelEntry[]) => Promise<void>} send
 * @param {(batch: PixelEntry[]) => void} onSaved
 * @param {number} [batchSize=600]
 */
export async function drainBoardQueue(pending, send, onSaved, batchSize = 600) {
  while (pending.size > 0) {
    const batch = [...pending.entries()].slice(0, batchSize);

    await send(batch);

    for (const [index, color] of batch) {
      if (pending.get(index) === color) pending.delete(index);
    }

    onSaved(batch);
  }
}
