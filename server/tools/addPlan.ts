import type { HistoryEntry, WsMessage } from '../../shared/contracts.ts'
import { broadcast } from '../ws.ts'
import { addEntry } from '../store/history.ts'
import { setPlan } from '../store/currentPlan.ts'

const TOOL_NAME = 'add-plan'

function emit(entry: HistoryEntry): void {
  addEntry(entry)
  broadcast({ type: 'history_update', entry })
}

function send(msg: WsMessage): void {
  broadcast(msg)
}

export async function runAddPlan(entry: HistoryEntry): Promise<void> {
  const correlationId = entry.correlationId
  const fileName = typeof entry.meta?.fileName === 'string' ? entry.meta.fileName : null
  const content = typeof entry.meta?.content === 'string' ? entry.meta.content : null

  emit({ ...entry, stage: 'running', timestamp: new Date().toISOString() })
  send({
    type: 'task_start',
    tool: TOOL_NAME,
    correlationId,
    message: `▶ Loading plan${fileName ? `: ${fileName}` : ''}`
  })

  if (!fileName || content === null) {
    send({
      type: 'task_end',
      tool: TOOL_NAME,
      correlationId,
      status: 'error',
      message: 'Plan file content missing'
    })
    emit({ ...entry, stage: 'failed', timestamp: new Date().toISOString() })
    return
  }

  if (!/\.md$/i.test(fileName)) {
    send({
      type: 'task_end',
      tool: TOOL_NAME,
      correlationId,
      status: 'error',
      message: `Unsupported file type: ${fileName}`
    })
    emit({ ...entry, stage: 'failed', timestamp: new Date().toISOString() })
    return
  }

  setPlan(fileName, content)
  send({
    type: 'output',
    tool: TOOL_NAME,
    correlationId,
    data: `Plan stored: ${fileName} (${content.length} chars)\n`
  })
  send({
    type: 'task_end',
    tool: TOOL_NAME,
    correlationId,
    status: 'success',
    message: `✅ Plan ready: ${fileName}`
  })
  emit({ ...entry, stage: 'done', timestamp: new Date().toISOString() })
}
