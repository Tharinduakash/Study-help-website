import "server-only";

// The first bytes ("magic numbers") each allowed format must start with. A renamed
// executable or script keeps its real bytes, so it fails here even with a .pdf name.
const PDF = [0x25, 0x50, 0x44, 0x46];
const ZIP = [0x50, 0x4b, 0x03, 0x04];
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];

const signatures: Record<string, number[]> = {
  ".pdf": PDF,
  ".docx": ZIP,
  ".xlsx": ZIP,
  ".pptx": ZIP,
  ".zip": ZIP,
  ".doc": OLE,
  ".xls": OLE,
  ".ppt": OLE,
  ".png": PNG,
  ".jpg": JPEG,
  ".jpeg": JPEG,
};

export const SIGNATURE_BYTES = 512;

export function contentMatchesName(name: string, head: Uint8Array) {
  const extension = name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  if (extension === ".txt" || extension === ".csv") return head.length > 0 && !head.includes(0);
  const signature = signatures[extension];
  return Boolean(signature) && signature.every((byte, index) => head[index] === byte);
}
