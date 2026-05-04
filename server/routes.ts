import { Router } from 'express'
import { PROJECT_DIR, UI_PORT } from './config.ts'
import { getByUser, clearUser, listUsers } from './history.ts'

const router = Router()

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