import { Router } from 'express'
import { PROJECT_DIR, UI_PORT } from './config.ts'
import { broadcast } from './ws.ts'
import { lint } from './tools/lint.ts'

const router = Router()

router.post('/api/run-tool', async (req, res) => {
  const { tool, projectDir } = req.body
  const cwd = projectDir || PROJECT_DIR
  try {
    let result
    if (tool === 'lint') result = await lint(cwd, broadcast)
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

export { router }