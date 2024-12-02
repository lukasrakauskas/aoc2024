import { TextLineStream } from "@std/streams/text-line-stream";
import * as path from "@std/path";



export async function* readInputLines(input: string) {
  const filePath = path.join(Deno.cwd(), input);

  const file = await Deno.open(filePath, { read: true });
  const stream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())

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