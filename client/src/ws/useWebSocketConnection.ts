import { useEffect } from 'react'
import type { WsMessage } from '@shared/contracts'
import { useStore } from '@store/useStore'
import { useSessionStore } from '@store/useSessionStore'
import { setSocket } from './socket'

const STAGE_STYLES: Record<string, string> = {
  queued: 'color:#a1a1aa',
  running: 'color:#eab308;font-weight:bold',
  done: 'color:#16a34a;font-weight:bold',
  failed: 'color:#dc2626;font-weight:bold',
  cancelled: 'color:#71717a'
}

function logHistory(msg: WsMessage): void {
  if (msg.type !== 'history_update') return
  const { entry } = msg
  const style = STAGE_STYLES[entry.stage] ?? ''
  console.log(
    `%c[history] ${entry.stage.padEnd(9)} %c${entry.action} %c${entry.correlationId.slice(0, 8)}`,
    style,
    'color:inherit',
    'color:#71717a',
    entry
  )
}

export function useWebSocketConnection(): void {
  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${location.host}`)
    let aborted = false

    setSocket(ws)

    ws.onopen = () => {
      if (aborted) return
      useStore.getState().setWsConnected(true)
      const { sessionId, userId } = useSessionStore.getState().startSession()
      ws.send(JSON.stringify({ type: 'session_init', sessionId, userId }))
    }

    ws.onclose = () => {
      if (aborted) return
      useStore.getState().setWsConnected(false)
      setSocket(null)
      useSessionStore.getState().endSession()
    }

    ws.onerror = () => {
      if (aborted) return
      useStore.getState().setWsConnected(false)
    }

    ws.onmessage = (e) => {
      if (aborted) return
      let msg: WsMessage
      try {
        msg = JSON.parse(e.data) as WsMessage
      } catch {
        return
      }
      if (msg.type === 'connected') return
      if (msg.type === 'history_update') {
        logHistory(msg)
        return
      }
      if (msg.type === 'task_end') useStore.getState().setActiveTask(null)
      useStore.getState().addLog(msg)
    }

    return () => {
      aborted = true
      ws.close()
    }
  }, [])
}