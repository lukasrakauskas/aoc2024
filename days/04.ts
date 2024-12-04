export async function solve() {
  const data = await Deno.readTextFile("inputs/04.txt");

  return [solveXmas(data), solveXShapedMas(data)];
}

function solveXmas(data: string) {
  const matrix = data.replaceAll("\r", "").split("\n").map((line) =>
    line.split("")
  );

  const KEYWORD = /XMAS|SAMX/g;

  const rotatedData = rotateMatrix(matrix).map((line) => line.join("")).join(
    "\n",
  );

  const halfRotatedData = rotateHalfMatrixLeft(matrix).map((line) =>
    line.join("")
  ).join("\n");

  const flippedHalfRotatedData = rotateHalfMatrixLeft(flipMatrix(matrix))
    .map((
      line,
    ) => line.join("")).join("\n");

  return findOverlappingMatches(
    [
      data,
      rotatedData,
      halfRotatedData,
      flippedHalfRotatedData,
    ].join("\n"),
    KEYWORD,
  );
}

function solveXShapedMas(data: string): number {
  const lines = data.replaceAll("\r", "").split("\n");
  let count = 0;

  for (let i = 1; i < lines.length - 1; i++) {
    for (let j = 1; j < lines[i].length - 1; j++) {
      const element = lines[i][j];

      if (element === "A" && verifyShape(lines, i, j)) {
        count++;
      }
    }
  }

  return count;
}

function verifyShape(lines: string[], x: number, y: number): boolean {
  const top = [lines[x - 1][y - 1], lines[x - 1][y + 1]].join("");
  const bottom = [lines[x + 1][y - 1], lines[x + 1][y + 1]].join("");

  if (top === "SS" && bottom === "MM") {
    return true;
  }

  if (top === "MM" && bottom === "SS") {
    return true;
  }

  const left = [lines[x - 1][y - 1], lines[x + 1][y - 1]].join("");
  const right = [lines[x - 1][y + 1], lines[x + 1][y + 1]].join("");

  if (left === "SS" && right === "MM") {
    return true;
  }

  if (left === "MM" && right === "SS") {
    return true;
  }

  return false;
}

function rotateMatrix<T>(matrix: T[][]): T[][] {
  const newMatrix: T[][] = Array.from({ length: matrix[0].length }, (_) => []);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      newMatrix[j][i] = matrix[i][j];
    }
  }

  return newMatrix;
}

function rotateHalfMatrixLeft<T>(matrix: T[][]): T[][] {
  const length = matrix.length + matrix[0].length;
  const newMatrix: T[][] = Array.from({ length }, (_) => []);

  for (let i = 0; i < matrix[0].length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      newMatrix[i + j].push(matrix[j][i]);
    }
  }

  return newMatrix;
}

function flipMatrix<T>(matrix: T[][]): T[][] {
  const newMatrix = structuredClone(matrix);

  for (let i = 0; i < newMatrix.length; i++) {
    newMatrix[i] = newMatrix[i].toReversed();
  }

  return newMatrix;
}

function findOverlappingMatches(haystack: string, needle: RegExp) {
  const matches = [];

  for (let i = 0; i < haystack.length; i++) {
    needle.lastIndex = i;
    const match = needle.exec(haystack);
    if (match) {
      matches.push({ match: match[0], index: match.index });
      i = match.index;
    }
  }

  return matches.length;
}
