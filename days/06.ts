const directions = {
  up: "^",
  down: "v",
  left: "<",
  right: ">",
};

const dirs: Record<string, [number, number]> = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1],
};

export async function solve() {
  const data = await Deno.readTextFile("inputs/06-test.txt");
  const lines = data.replaceAll("\r", "").split("\n").map((it) => it.split(""));

  let positions = new Set();

  // for (let i = 0; i < lines.length; i++) {
  //   for (let j = 0; j < lines[0].length; j++) {
  //     if (lines[i][j] === ".") {
  //       if (foundLoop(lines, [i, j])) {
  //         positions.add(`${i},${j}`);
  //       }
  //     }
  //   }
  // }

  return [solveMappedArea(lines), positions.size];
}

function foundLoop(lines: string[][], block: [number, number]) {
  lines = structuredClone(lines);
  lines[block[0]][block[1]] = "#";

  const visited = new Set();

  let [x, y] = findCurrentPosition(lines);

  let nx = -1, ny = -1;
  while (true) {
    [nx, ny] = nextPosition(lines, [x, y]);

    console.log(visited);

    if (isOutOfBounds(lines, [nx, ny])) {
      return false;
    }

    if (visited.has(`${nx},${ny},${lines[nx][ny]}`)) {
      return true;
    }

    if (isBlockingPosition(lines, [nx, ny])) {
      lines[x][y] = rotate(lines[x][y]);
    } else {
      const guard = lines[x][y];

      lines[nx][ny] = guard;
      x = nx;
      y = ny;
    }

    visited.add(`${x},${y},${lines[x][y]}`);
  }
}

function solveMappedArea(lines: string[][]) {
  lines = structuredClone(lines);

  let [x, y] = findCurrentPosition(lines);

  while (true) {
    const [nx, ny] = nextPosition(lines, [x, y]);

    if (isOutOfBounds(lines, [nx, ny])) {
      lines[x][y] = "X";
      break;
    } else if (isBlockingPosition(lines, [nx, ny])) {
      lines[x][y] = rotate(lines[x][y]);
    } else {
      const guard = lines[x][y];
      lines[x][y] = "X";
      lines[nx][ny] = guard;
      x = nx;
      y = ny;
    }
  }

  return count(lines.map((it) => it.join("")).join(""));
}

function findCurrentPosition(lines: string[][]) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const element = lines[i][j];

      if (Object.values(directions).includes(element)) {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

function nextPosition(
  lines: string[][],
  [x, y]: [number, number],
): [number, number] {
  const direction = lines[x][y];
  const [dx, dy] = dirs[direction];

  return [x + dx, y + dy];
}

function isBlockingPosition(
  lines: string[][],
  [x, y]: [number, number],
): boolean {
  return lines[x][y] === "#";
}

function rotate(dir: string) {
  const keys = Object.keys(dirs);
  const currentIndex = keys.indexOf(dir);
  const nextIndex = (currentIndex + 1) % keys.length;
  return keys[nextIndex];
}

function isOutOfBounds(lines: string[][], [x, y]: [number, number]): boolean {
  if (x < 0) return true;
  if (x > lines.length - 1) return true;
  if (y < 0) return true;
  if (y > lines[0].length - 1) return true;

  return false;
}

function count(data: string) {
  let num = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === "X") {
      num++;
    }
  }

  return num;
}
