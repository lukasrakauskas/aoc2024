export async function solve() {
  const data = await Deno.readTextFile("inputs/03.txt");

  const instructions = [
    ...data.matchAll(/(mul\([0-9]+\,[0-9]+\))/g).map(
      (it) => it[0],
    ),
  ];

  const instructionsWithToggle = [
    ...data.matchAll(/(mul\([0-9]+\,[0-9]+\))|(don\'t\(\))|(do\(\))/g).map(
      (it) => it[0],
    ),
  ];

  return [
    processInstructions(instructions),
    processInstructionsWithToggle(instructionsWithToggle),
  ];
}
function processInstructions(instructions: string[]): number {
  let sum = 0;

  for (const instruction of instructions) {
    const [x, y] = instruction.match(/\d+/g)?.map((it) => parseInt(it, 10)) ??
      [0, 0];

    sum += x * y;
  }

  return sum;
}

function processInstructionsWithToggle(instructions: string[]): number {
  let sum = 0;
  let enabled = true;

  for (const instruction of instructions) {
    if (instruction.startsWith("mul")) {
      if (enabled) {
        const [x, y] = instruction.match(/\d+/g)?.map((it) =>
          parseInt(it, 10)
        ) ?? [0, 0];
        sum += x * y;
      }
    } else if (instruction === `don't()`) {
      enabled = false;
    } else if (instruction === "do()") {
      enabled = true;
    }
  }

  return sum;
}
