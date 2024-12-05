import { TextLineStream } from "@std/streams/text-line-stream";
import * as path from "@std/path";

export async function* readInputLines(input: string) {
  const filePath = path.join(Deno.cwd(), input);

  const file = await Deno.open(filePath, { read: true });
  const stream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  try {
    for await (const line of stream) {
      yield line;
    }
  } finally {
    try {
      file.close();
    } catch {
      // noop
    }
  }
}

export async function runSolveForAllFiles(directory: string) {
  // Ensure we're working with an absolute path
  const resolvedDir = path.join(Deno.cwd(), directory);

  // Read all entries in the directory
  for await (const dirEntry of Deno.readDir(resolvedDir)) {
    if (dirEntry.isFile) {
      const filePath = path.join(resolvedDir, dirEntry.name);

      try {
        // Dynamically import the module
        const module = await import(`file://${filePath}`);

        // Check if solve function exists
        if (typeof module.solve === "function") {
          console.time(dirEntry.name);
          const result = await module.solve();
          console.timeEnd(dirEntry.name);
          console.log(`Result:`, result);
        }
      } catch (error) {
        console.error(`Error processing ${dirEntry.name}:`, error);
      }
    }
  }
}

export function sum(array: number[]) {
  return array.reduce((x, y) => x + y, 0);
}

/**
 * Returns two arrays separated on predicate, first is truthy, second - falsy
 */
export function separate<T>(array: T[], predicate: (value: T) => boolean) {
  const truthy: T[] = [];
  const falsy: T[] = [];

  for (const element of array) {
    const output = predicate(element) ? truthy : falsy;
    output.push(element);
  }

  return [truthy, falsy] as const;
}
