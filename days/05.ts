import { separate, sum } from "../utils.ts";

export async function solve() {
  const data = await Deno.readTextFile("inputs/05.txt");
  const [orderingData, updateData] = data.replaceAll("\r", "").split("\n\n");
  const orderings = orderingData.split("\n").map((it) => it.split("|"));
  const updates = updateData.split("\n").map((it) => it.split(","));

  const afterMap = new Map<string, string[]>();
  const beforeMap = new Map<string, string[]>();

  for (const [before, after] of orderings) {
    if (afterMap.has(before)) {
      afterMap.set(before, [...(afterMap.get(before) ?? []), after]);
    } else {
      afterMap.set(before, [after]);
    }

    if (beforeMap.has(after)) {
      beforeMap.set(after, [...(beforeMap.get(after) ?? []), before]);
    } else {
      beforeMap.set(after, [before]);
    }
  }

  const isUpdateInRightOrder = getIsUpdateInRightOrderFunction(
    afterMap,
    beforeMap,
  );

  const fixUpdateOrder = getFixUpdateOrderFunction(
    afterMap,
    beforeMap,
  );

  const [inOrderUpdates, outOfOrderUpdates] = separate(
    updates,
    isUpdateInRightOrder,
  );

  const middleSum1 = sum(
    inOrderUpdates.map((
      it,
    ) => parseInt(it[it.length / 2 | 0], 10)),
  );

  const fixedUpdates = outOfOrderUpdates.map((it) => fixUpdateOrder(it));

  const middleSum2 = sum(
    fixedUpdates.map((
      it,
    ) => parseInt(it[it.length / 2 | 0], 10)),
  );

  return [middleSum1, middleSum2];
}

function getIsUpdateInRightOrderFunction(
  afterMap: Map<string, string[]>,
  beforeMap: Map<string, string[]>,
): (update: string[]) => boolean {
  return (update) => {
    for (let i = 0; i < update.length; i++) {
      const page = update[i];

      const after = afterMap.get(page) ?? [];

      const badAfter = after.some((p) => {
        const j = update.indexOf(p);

        if (j === -1) {
          return false;
        }

        return j < i;
      });

      if (badAfter) {
        return false;
      }

      const before = beforeMap.get(page) ?? [];

      const badBefore = before.some((p) => {
        const j = update.indexOf(p);

        if (j === -1) {
          return false;
        }

        return j > i;
      });

      if (badBefore) {
        return false;
      }
    }

    return true;
  };
}

function getFixUpdateOrderFunction(
  afterMap: Map<string, string[]>,
  beforeMap: Map<string, string[]>,
): (update: string[]) => string[] {
  return (outOfOrderUpdate) => {
    const update = structuredClone(outOfOrderUpdate);

    update.sort((a, b) => {
      const after = afterMap.get(a) ?? [];
      const before = beforeMap.get(a) ?? [];

      if (after.includes(b)) {
        return 1;
      }

      if (before.includes(b)) {
        return -1;
      }

      return 0;
    });

    return update;
  };
}
