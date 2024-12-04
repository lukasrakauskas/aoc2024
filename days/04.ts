export async function solve() {
  const data = await Deno.readTextFile("inputs/04.txt");
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

  const count = findOverlappingMatches(
    [
      data,
      rotatedData,
      halfRotatedData,
      flippedHalfRotatedData,
    ].join("\n"),
    KEYWORD,
  );

  return [count];
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
