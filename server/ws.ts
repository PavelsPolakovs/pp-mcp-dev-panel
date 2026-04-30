import { WebSocket, WebSocketServer } from 'ws'
import type { Server } from 'http'

export type WsMessage =
  | { type: 'connected'; message: string }
  | { type: 'task_start'; tool: string; message: string }
  | { type: 'output'; tool: string; data: string }
  | { type: 'task_end'; tool: string; status: 'success' | 'warning' | 'error'; message: string }

const clients = new Set<WebSocket>()

export function broadcast(payload: WsMessage): void {
  const msg = JSON.stringify(payload)
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg)
  }
}

export function attachWebSocket(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer })
  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws)
    ws.send(JSON.stringify({ type: 'connected', message: 'MCP Dev Panel connected' }))
    ws.on('close', () => clients.delete(ws))
  })
}