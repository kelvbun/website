import assert from "node:assert/strict";
import test from "node:test";
import { drainBoardQueue } from "./board-outbox.js";

test("drains edits added while a save is in flight", async () => {
  const pending = new Map([[1, 1]]);
  const sent = [];
  let firstBatch = true;

  await drainBoardQueue(
    pending,
    async (batch) => {
      sent.push(batch);

      if (firstBatch) {
        firstBatch = false;
        pending.set(1, 2);
        pending.set(3, 4);
      }
    },
    () => {},
    1,
  );

  assert.deepEqual(sent, [[[1, 1]], [[1, 2]], [[3, 4]]]);
  assert.equal(pending.size, 0);
});

test("keeps a batch queued when saving fails", async () => {
  const pending = new Map([[5, 6]]);

  await assert.rejects(
    drainBoardQueue(
      pending,
      async () => {
        throw new Error("save failed");
      },
      () => {},
    ),
    /save failed/,
  );

  assert.deepEqual([...pending], [[5, 6]]);
});
