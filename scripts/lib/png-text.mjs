// Adds (or replaces) a PNG tEXt chunk, used to record where a generated raster came from.
import { readFileSync, writeFileSync } from 'node:fs';
import { crc32 } from 'node:zlib';

export function setPngText(file, key, text) {
  const buf = readFileSync(file);
  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('latin1', off + 4, off + 8);
    const end = off + 12 + len;
    const isOld = type === 'tEXt' && buf.toString('latin1', off + 8, off + 8 + key.length + 1) === key + '\0';
    if (!isOld) chunks.push({ type, raw: buf.subarray(off, end) });
    off = end;
  }
  const data = Buffer.concat([Buffer.from(key + '\0', 'latin1'), Buffer.from(text, 'latin1')]);
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write('tEXt', 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  const text_ = Buffer.concat([head, data, crc]);
  const out = chunks.flatMap((c) => (c.type === 'IEND' ? [text_, c.raw] : [c.raw]));
  writeFileSync(file, Buffer.concat([buf.subarray(0, 8), ...out]));
}
