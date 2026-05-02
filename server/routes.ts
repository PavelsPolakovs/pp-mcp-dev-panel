import { Router } from 'express'
import { PROJECT_DIR, UI_PORT } from './config.ts'
import { broadcast } from './ws.ts'
import { lint } from './tools/lint.ts'
import { getByUser, clearUser, listUsers } from './history.ts'
import { getUserId } from './sessions.ts'

const router = Router()

router.post('/api/run-tool', async (req, res) => {
  const { tool, projectDir, sessionId } = req.body as {
    tool?: string
    projectDir?: string
    sessionId?: string
  }
  const cwd = projectDir || PROJECT_DIR
  const userId = sessionId ? getUserId(sessionId) : null
  const history = sessionId && userId ? { sessionId, userId } : undefined

  try {
    let result
    if (tool === 'lint') result = await lint(cwd, broadcast, history)
    else return res.status(400).json({ error: `Unknown tool: ${tool}` })
    res.json({ ok: true, result })
  } catch (err: unknown) {
    let message = 'Unknown error'
    if (
      err &&
      typeof err === 'object' &&
      'message' in err &&
      typeof (err as { message?: unknown }).message === 'string'
    ) {
      message = (err as { message: string }).message
    }
    res.status(500).json({ ok: false, error: message })
  }
})

router.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', projectDir: PROJECT_DIR, port: UI_PORT })
})

router.get('/api/history/user/:userId', (req, res) => {
  res.json(getByUser(req.params.userId))
})

router.delete('/api/history/user/:userId', (req, res) => {
  clearUser(req.params.userId)
  res.status(204).end()
})

router.get('/api/sessions', (_req, res) => {
  res.json(listUsers())
})

export { router }
