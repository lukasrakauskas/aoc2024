import {
  addPoints,
  distance,
  findAll,
  getTile,
  isEqualPoints,
  isInside,
  Point,
  setTile,
} from "../grid.ts";

export async function solve() {
  const data = await Deno.readTextFile("inputs/08.txt");

  const antinodeCount = solveAntinodeCount(data);

  return [antinodeCount];
}

function solveAntinodeCount(data: string) {
  const lines = data.replaceAll("\r", "").split("\n");
  const grid = lines.map((it) => it.split(""));
  const nodes = new Set(data.replaceAll(/(\n)|(\r)|\./g, ""));

  const nodePointMap = new Map<string, Point[]>();

  for (const node of nodes) {
    nodePointMap.set(node, findAll(grid, node));
  }

  const antinodePoints: Point[] = [];

  for (const [node, points] of nodePointMap.entries()) {
    if (points.length < 2) continue;

    for (let i = 0; i < points.length; i++) {
      for (let j = i; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];

        if (isEqualPoints(p1, p2)) continue;

        const distance1 = distance(p1, p2);
        const distance2 = distance(p2, p1);

        const antinode1 = addPoints(p2, distance1);
        const antinode2 = addPoints(p1, distance2);

        if (isInside(grid, antinode1)) {
          const tile = getTile(grid, antinode1);

          // if tile is not same node or antinode already
          if (tile !== node && tile !== "#") {
            antinodePoints.push(antinode1);
          }

          if (tile === ".") {
            setTile(grid, antinode1, "#");
          }
        }

        if (isInside(grid, antinode2)) {
          const tile = getTile(grid, antinode2);

          if (tile !== node && tile !== "#") {
            antinodePoints.push(antinode2);
          }

          if (tile === ".") {
            setTile(grid, antinode2, "#");
          }
        }
      }
    }
  }

  const deduped = new Set([...antinodePoints.map(([x, y]) => `${x},${y}`)]);

  return deduped.size;
}
