import type { Vault } from "./types.js";

export function appendLog(vault: Vault, line: string): void {
  vault.log.push(line);
}
