export function nextId(prefix: string, count: number): string {
  return `${prefix}${count + 1}`;
}
