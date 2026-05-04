import type { EventRequest, EventResponse, WorkflowAction, Initiator } from '@shared/contracts'
import { useSessionStore } from '@store/useSessionStore'
import { useStore } from '@store/useStore'

function buildInitiator(): Initiator {
  const session = useSessionStore.getState()
  const userId = session.userId || useStore.getState().user.id
  return {
    kind: 'user',
    sessionId: session.sessionId,
    userId: userId || null
  }
}

export async function postEvent(
  action: WorkflowAction,
  meta?: Record<string, unknown>
): Promise<string | null> {
  const body: EventRequest = { action, initiator: buildInitiator(), meta }
  try {
    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) return null
    const data = (await res.json()) as EventResponse
    return data.correlationId
  } catch {
    return null
  }
}
