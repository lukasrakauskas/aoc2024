import { readInputLines } from "../utils.ts";

// not 10598741
// not 48810620
// not 5309014

// That's not the right answer; your answer is too low

export async function solve() {
  let sum = 0;
  let sumWithDos = 0;

  const from = `don't()`;
  const to = `do()`;

  const data = await Deno.readTextFile("inputs/03-test.txt");

  const muls = [...data.matchAll(/mul\([0-9]+\,[0-9]+\)/gs)].map((it) =>
    it[0].replace("mul(", "").replace(")", "").split(",").map(Number)
  ).map((it) => it[0] * it[1]);

  sum += muls.reduce((a, b) => a + b, 0);

  const middleRemoved = data.replaceAll(/don\'t\(\).+do\(\)/gs, "");

  // const endRemoved = middleRemoved.slice(middleRemoved.indexOf(from));

  const muls2 = [
    ...middleRemoved.matchAll(
      /mul\([0-9]+\,[0-9]+\)/g,
    ),
  ].map((it) =>
    it[0].replace("mul(", "").replace(")", "").split(",").map((it) => {
      console.log(it);
      return parseInt(it);
    })
  ).map((it) => it[0] * it[1]);

  sumWithDos += muls2.reduce((a, b) => a + b, 0);

  return [sum, sumWithDos];
}
