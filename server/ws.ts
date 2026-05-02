import { WebSocket, WebSocketServer } from 'ws'
import type { Server } from 'http'
import type { ActionRecord } from './types/history.ts'
import { appendAction } from './history.ts'
import { registerSession, unregisterSession, getUserId } from './sessions.ts'

export type ServerWsMessage =
  | { type: 'connected'; message: string }
  | { type: 'task_start'; tool: string; message: string }
  | { type: 'output'; tool: string; data: string }
  | { type: 'task_end'; tool: string; status: 'success' | 'warning' | 'error'; message: string }
  | { type: 'history_update'; record: ActionRecord }

export type ClientWsMessage =
  | { type: 'session_init'; sessionId: string; userId: string }
  | { type: 'plan_added'; sessionId: string; userId: string; fileName: string }

export type WsMessage = ServerWsMessage

interface TrackedClient {
  socket: WebSocket
  sessionId: string | null
}

const clients = new Set<TrackedClient>()

export function broadcast(payload: ServerWsMessage): void {
  const msg = JSON.stringify(payload)
  for (const client of clients) {
    if (client.socket.readyState === WebSocket.OPEN) client.socket.send(msg)
  }
}

function handleSessionInit(client: TrackedClient, msg: ClientWsMessage): void {
  if (msg.type !== 'session_init') return
  client.sessionId = msg.sessionId
  registerSession(msg.sessionId, msg.userId)
}

function handlePlanAdded(client: TrackedClient, msg: ClientWsMessage): void {
  if (msg.type !== 'plan_added') return
  const sessionId = msg.sessionId || client.sessionId
  const userId = msg.userId || (sessionId ? getUserId(sessionId) : null)
  if (!sessionId || !userId) return
  const record = appendAction({
    sessionId,
    userId,
    type: 'file_upload',
    payload: { fileName: msg.fileName },
    status: 'success'
  })
  broadcast({ type: 'history_update', record })
  broadcast({ type: 'output', tool: 'plan', data: `Plan file added: ${msg.fileName}\n` })
}

export function attachWebSocket(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer })
  wss.on('connection', (ws: WebSocket) => {
    const client: TrackedClient = { socket: ws, sessionId: null }
    clients.add(client)
    ws.send(JSON.stringify({ type: 'connected', message: 'MCP Dev Panel connected' }))

    ws.on('message', (raw) => {
      let parsed: ClientWsMessage
      try {
        parsed = JSON.parse(raw.toString()) as ClientWsMessage
      } catch {
        return
      }
      switch (parsed.type) {
        case 'session_init':
          handleSessionInit(client, parsed)
          break
        case 'plan_added':
          handlePlanAdded(client, parsed)
          break
      }
    })

    ws.on('close', () => {
      if (client.sessionId) unregisterSession(client.sessionId)
      clients.delete(client)
    })
  })
}
