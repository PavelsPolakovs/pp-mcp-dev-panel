import { useEffect } from 'react'
import { useStore } from '@store/useStore'
import { useSessionStore } from '@store/useSessionStore'
import { setSocket } from './socket'

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
      void useSessionStore.getState().fetchHistory(userId)
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
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'connected') return
        if (msg.type === 'history_update') {
          useSessionStore.getState().addHistoryRecord(msg.record)
          return
        }
        if (msg.type === 'task_end') useStore.getState().setActiveTask(null)
        useStore.getState().addLog(msg)
      } catch {
        // ignore non-JSON or malformed frames
      }
    }

    return () => {
      aborted = true
      ws.close()
    }
  }, [])
}
