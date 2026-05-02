const sessions = new Map<string, string>()

export function registerSession(sessionId: string, userId: string): void {
  sessions.set(sessionId, userId)
}

export function unregisterSession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function getUserId(sessionId: string): string | null {
  return sessions.get(sessionId) ?? null
}

export function listSessions(): { sessionId: string; userId: string }[] {
  return [...sessions.entries()].map(([sessionId, userId]) => ({ sessionId, userId }))
}
