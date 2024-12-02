import { readInputLines } from "../utils.ts";

export async function solve() {
  const list1: number[] = [];
  const list2: number[] = [];

  for await (const data of readInputLines("inputs/01.txt")) {
    const [a, b] = data.split(" ").filter(Number).map(Number);
    list1.push(a);
    list2.push(b);
  }

  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);

  const distance = solveDistance(list1, list2);
  console.log("Distance", distance);

  const similarity = solveSimilarity(list1, list2);
  console.log("Similarity", similarity)
}

function solveDistance(list1: number[], list2: number[]): number {
  let distance = 0;
  for (let i = 0; i < list1.length; i++) {
    const a = list1[i];
    const b = list2[i];

    distance += Math.abs(a - b);
  }
  return distance;
}

function solveSimilarity(list1: number[], list2: number[]): number {
  let similarity = 0;

  for (const number of list1) {
    const x = list2.indexOf(number);
    const y = list2.lastIndexOf(number)

    if (x == -1 || y == -1) {
      continue;
    }

    const times = y - x + 1
    similarity += number * times;
  }

  return similarity;
}
