import { sum } from "../utils.ts";

export async function solve() {
  const data = await Deno.readTextFile("inputs/07-test.txt");
  const lines = data.replaceAll("\r", "").split("\n");
  const entries = lines.map((it) => {
    const [result, ...numbers] = it.split(" ").map((it) => parseInt(it, 10));
    return { result, numbers };
  });

  const total = sum(
    entries.filter((it) => solveIt(it.result, it.numbers)).map((it) =>
      it.result
    ),
  );

  return [total];
}

function solveIt(result: number, numbers: number[], partial = result): boolean {
  if (partial === 0) {
    return true;
  }

  if (partial === result && numbers.length === 1) {
    return true;
  }

  // console.log(partial);

  const number = numbers.pop();

  if (!number) return false;

  if (partial % number === 0) {
    return solveIt(result, numbers, partial %= number) ||
      solveIt(result, numbers, partial - number);
  } else {
    return solveIt(result, numbers, partial - number);
  }
}
