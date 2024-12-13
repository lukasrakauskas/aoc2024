import {
  addPoints,
  distance,
  findAll,
  getTile,
  Grid,
  isEqualPoints,
  isInside,
  Point,
  setTile,
} from "../grid.ts";
import { sum } from "../utils.ts";

export async function solve() {
  const data = await Deno.readTextFile("inputs/08.txt");

  return [solveAntinodeCount(data), solveAntinodeResonantCount(data)];
}

function isValidAntinode(grid: Grid<string>, point: Point, node: string) {
  let valid = false;

  if (isInside(grid, point)) {
    const tile = getTile(grid, point);

    // if tile is not same node or antinode already
    if (tile !== node && tile !== "#") {
      valid = true;
    }

    if (tile === ".") {
      setTile(grid, point, "#");
    }
  }

  return valid;
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

        const d = distance(p1, p2);

        const antinode1 = addPoints(p2, d);
        const antinode2 = addPoints(p1, d);

        if (isValidAntinode(grid, antinode1, node)) {
          antinodePoints.push(antinode1);
        }

        if (isValidAntinode(grid, antinode2, node)) {
          antinodePoints.push(antinode2);
        }
      }
    }
  }

  const deduped = new Set([...antinodePoints.map(([x, y]) => `${x},${y}`)]);

  return deduped.size;
}

function solveAntinodeResonantCount(data: string) {
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

        const dist1 = distance(p1, p2);
        const dist2 = distance(p2, p1);

        if (isValidAntinode(grid, p1, node)) {
          antinodePoints.push(p1);
        }
        if (isValidAntinode(grid, p2, node)) {
          antinodePoints.push(p2);
        }

        antinodePoints.push(...validateLine(p1, dist1, grid, node));
        antinodePoints.push(...validateLine(p1, dist2, grid, node));
        antinodePoints.push(...validateLine(p2, dist1, grid, node));
        antinodePoints.push(...validateLine(p2, dist2, grid, node));
      }
    }
  }

  const nodeCounts = Array.from([...nodes, "#"]).map((it) =>
    findAll(grid, it).length
  );

  return sum(nodeCounts);
}

function validateLine(
  point: Point,
  distance: Point,
  grid: string[][],
  node: string,
) {
  const antinodes: Point[] = [];

  let antinode = addPoints(point, distance);

  while (isInside(grid, antinode)) {
    if (isValidAntinode(grid, antinode, node)) {
      antinodes.push(antinode);
    }

    antinode = addPoints(antinode, distance);
  }

  return antinodes;
}
