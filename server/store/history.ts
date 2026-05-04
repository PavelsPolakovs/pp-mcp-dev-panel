import type { HistoryEntry } from '../../shared/contracts.ts'

const entries: HistoryEntry[] = []

export function addEntry(entry: HistoryEntry): void {
  entries.push(entry)
}

export function getAll(): HistoryEntry[] {
  return entries.slice()
}

export function clear(): void {
  entries.length = 0
}