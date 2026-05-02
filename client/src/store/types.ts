export type ActionType = 'tool_run' | 'file_upload' | 'settings_change' | 'navigation'
export type ActionStatus = 'pending' | 'success' | 'error'

export interface ActionRecord {
  id: string
  sessionId: string
  userId: string
  type: ActionType
  payload: Record<string, unknown>
  timestamp: string
  status: ActionStatus
}
