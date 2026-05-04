import { Router } from 'express'
import { randomUUID } from 'crypto'
import type {
  EventRequest,
  EventResponse,
  HistoryEntry,
  Initiator,
  WorkflowAction
} from '../shared/contracts.ts'
import { PROJECT_DIR, UI_PORT } from './config.ts'
import { broadcast } from './ws.ts'
import { addEntry, getAll } from './store/history.ts'
import { runAddPlan } from './tools/addPlan.ts'

const router = Router()

const VALID_ACTIONS: ReadonlySet<WorkflowAction> = new Set([
  'plan_modal_open',
  'plan_file_selected',
  'plan_confirmed',
  'plan_cancelled'
])

function isValidAction(value: unknown): value is WorkflowAction {
  return typeof value === 'string' && VALID_ACTIONS.has(value as WorkflowAction)
}

function isValidInitiator(value: unknown): value is Initiator {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  if (v.kind !== 'user' && v.kind !== 'agent') return false
  if (v.sessionId !== null && typeof v.sessionId !== 'string') return false
  if (v.userId !== null && typeof v.userId !== 'string') return false
  return true
}

router.post('/api/event', async (req, res) => {
  const body = req.body as Partial<EventRequest>
  if (!isValidAction(body.action)) {
    return res.status(400).json({ error: 'Invalid action' })
  }
  if (!isValidInitiator(body.initiator)) {
    return res.status(400).json({ error: 'Invalid initiator' })
  }

  const entry: HistoryEntry = {
    correlationId: randomUUID(),
    action: body.action,
    initiator: body.initiator,
    stage: 'queued',
    timestamp: new Date().toISOString(),
    meta: body.meta
  }

  addEntry(entry)
  broadcast({ type: 'history_update', entry })

  if (entry.action === 'plan_confirmed') {
    void runAddPlan(entry).catch((err) => {
      process.stderr.write(`[add-plan] error: ${String(err)}\n`)
    })
  }

  const response: EventResponse = { correlationId: entry.correlationId }
  res.status(201).json(response)
})

router.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', projectDir: PROJECT_DIR, port: UI_PORT })
})

router.get('/api/history', (_req, res) => {
  res.json(getAll())
})

export { router }