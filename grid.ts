export type Point = [x: number, y: number];
export type Grid<T> = T[][];

export function distance(
  [lx, ly]: Point,
  [rx, ry]: Point,
): Point {
  return [rx - lx, ry - ly];
}

export function isOutside(grid: Grid<unknown>, [x, y]: Point) {
  return (
    x < 0 &&
    x >= grid.length &&
    y < 0 &&
    y >= grid[0].length
  );
}

export function isInside(grid: Grid<unknown>, [x, y]: Point) {
  return (
    x >= 0 &&
    x < grid.length &&
    y >= 0 &&
    y < grid[0].length
  );
}

export function findAll<T>(grid: Grid<T>, value: T) {
  const points: Point[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const element = grid[i][j];
      if (element === value) {
        points.push([i, j]);
      }
    }
  }

  return points;
}

export function getTile<T>(grid: Grid<T>, [x, y]: Point) {
  return grid[x][y];
}

export function setTile<T>(grid: Grid<T>, [x, y]: Point, value: T) {
  grid[x][y] = value;
}

export function isEqualPoints([lx, ly]: Point, [rx, ry]: Point) {
  return lx === rx && ly === ry;
}

export function addPoints([lx, ly]: Point, [rx, ry]: Point): Point {
  return [lx + rx, ly + ry];
}

export function subtractPoints([lx, ly]: Point, [rx, ry]: Point): Point {
  return [lx - rx, ly - ry];
}

export function printGrid(grid: Grid<unknown>) {
  return grid.map((it) => it.join("")).join("\n");
}
