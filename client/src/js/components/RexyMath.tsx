export function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}


export function shortenMiddle(str: string, startLength = 6, endLength = 4): string {
  if (str.length <= startLength + endLength + 3) return str;
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
}