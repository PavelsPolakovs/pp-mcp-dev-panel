import { randomUUID } from 'crypto'
import type { ActionRecord, ActionStatus, ActionType } from './types/history.ts'

const MAX_RECORDS_PER_USER = 500
const records = new Map<string, ActionRecord[]>()

export interface AppendInput {
  sessionId: string
  userId: string
  type: ActionType
  payload: Record<string, unknown>
  status?: ActionStatus
}

export function appendAction(input: AppendInput): ActionRecord {
  const record: ActionRecord = {
    id: randomUUID(),
    sessionId: input.sessionId,
    userId: input.userId,
    type: input.type,
    payload: input.payload,
    timestamp: new Date().toISOString(),
    status: input.status ?? 'pending'
  }
  const list = records.get(input.userId) ?? []
  list.push(record)
  if (list.length > MAX_RECORDS_PER_USER) list.splice(0, list.length - MAX_RECORDS_PER_USER)
  records.set(input.userId, list)
  return record
}

export function updateAction(
  userId: string,
  id: string,
  patch: Partial<Pick<ActionRecord, 'status' | 'payload'>>
): ActionRecord | null {
  const list = records.get(userId)
  if (!list) return null
  const idx = list.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const next: ActionRecord = {
    ...list[idx],
    ...patch,
    payload: patch.payload ? { ...list[idx].payload, ...patch.payload } : list[idx].payload,
    timestamp: new Date().toISOString()
  }
  list[idx] = next
  return next
}

export function getByUser(userId: string): ActionRecord[] {
  return records.get(userId) ?? []
}

export function clearUser(userId: string): void {
  records.delete(userId)
}

export function listUsers(): { userId: string; count: number }[] {
  return [...records.entries()].map(([userId, list]) => ({ userId, count: list.length }))
}
