import type { Vault } from "./types.js";

export function enqueueNotice(vault: Vault, line: string): void {
  vault.outbox.push(line);
}
