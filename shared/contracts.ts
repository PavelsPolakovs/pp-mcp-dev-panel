export type Stage = 'queued' | 'running' | 'done' | 'failed' | 'cancelled'

export type WorkflowAction =
  | 'plan_modal_open'
  | 'plan_file_selected'
  | 'plan_confirmed'
  | 'plan_cancelled'

export type InitiatorKind = 'user' | 'agent'

export interface Initiator {
  kind: InitiatorKind
  sessionId: string | null
  userId: string | null
}

export interface HistoryEntry {
  correlationId: string
  action: WorkflowAction
  initiator: Initiator
  stage: Stage
  timestamp: string
  meta?: Record<string, unknown>
}

export type TaskEndStatus = 'success' | 'warning' | 'error'

export type WsMessage =
  | { type: 'connected'; message: string }
  | { type: 'task_start'; tool: string; correlationId?: string; message: string }
  | { type: 'output'; tool: string; correlationId?: string; data: string }
  | {
      type: 'task_end'
      tool: string
      correlationId?: string
      status: TaskEndStatus
      message: string
    }
  | { type: 'history_update'; entry: HistoryEntry }

export interface EventRequest {
  action: WorkflowAction
  initiator: Initiator
  meta?: Record<string, unknown>
}

export interface EventResponse {
  correlationId: string
}

export type ClientWsMessage = {
  type: 'session_init'
  sessionId: string
  userId: string
}