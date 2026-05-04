import { WebSocket, WebSocketServer } from 'ws'
import type { Server } from 'http'
import type { ClientWsMessage, WsMessage } from '../shared/contracts.ts'

interface TrackedClient {
  socket: WebSocket
  sessionId: string | null
  userId: string | null
}

const clients = new Set<TrackedClient>()

export function broadcast(payload: WsMessage): void {
  const msg = JSON.stringify(payload)
  for (const client of clients) {
    if (client.socket.readyState === WebSocket.OPEN) client.socket.send(msg)
  }
}

export function attachWebSocket(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer })
  wss.on('connection', (ws: WebSocket) => {
    const client: TrackedClient = { socket: ws, sessionId: null, userId: null }
    clients.add(client)
    ws.send(JSON.stringify({ type: 'connected', message: 'MCP Dev Panel connected' } as WsMessage))

    ws.on('message', (raw) => {
      let parsed: ClientWsMessage
      try {
        parsed = JSON.parse(raw.toString()) as ClientWsMessage
      } catch {
        return
      }
      if (parsed.type === 'session_init') {
        client.sessionId = parsed.sessionId
        client.userId = parsed.userId
      }
    })

    ws.on('close', () => {
      clients.delete(client)
    })
  })
}
