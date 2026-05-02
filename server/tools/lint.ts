import { spawn } from 'child_process'
import type { ServerWsMessage } from '../ws.ts'
import { appendAction, updateAction } from '../history.ts'

export interface LintHistoryContext {
  sessionId: string
  userId: string
}

export async function lint(
  cwd: string,
  broadcast: (payload: ServerWsMessage) => void,
  history?: LintHistoryContext
): Promise<string> {
  return new Promise((resolve, reject) => {
    broadcast({ type: 'task_start', tool: 'lint', message: '▶ Running ESLint...' })

    let actionId: string | null = null
    if (history) {
      const record = appendAction({
        sessionId: history.sessionId,
        userId: history.userId,
        type: 'tool_run',
        payload: { tool: 'lint', cwd },
        status: 'pending'
      })
      actionId = record.id
      broadcast({ type: 'history_update', record })
    }

    const finalize = (status: 'success' | 'error', message: string): void => {
      if (history && actionId) {
        const updated = updateAction(history.userId, actionId, {
          status,
          payload: { message }
        })
        if (updated) broadcast({ type: 'history_update', record: updated })
      }
    }

    const proc = spawn('npm', ['run', 'lint'], {
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' }
    })

    proc.stdout.on('data', (d) => broadcast({ type: 'output', tool: 'lint', data: d.toString() }))
    proc.stderr.on('data', (d) => broadcast({ type: 'output', tool: 'lint', data: d.toString() }))

    proc.on('close', (code) => {
      const status = code === 0 ? 'success' : 'warning'
      const message = code === 0 ? '✅ No lint errors' : `⚠️ Lint issues found (exit ${code})`
      broadcast({ type: 'task_end', tool: 'lint', status, message })
      finalize(code === 0 ? 'success' : 'error', message)
      resolve(message)
    })
    proc.on('error', (err) => {
      broadcast({ type: 'task_end', tool: 'lint', status: 'error', message: err.message })
      finalize('error', err.message)
      reject(err)
    })
  })
}
