let socket: WebSocket | null = null

export function setSocket(s: WebSocket | null): void {
  socket = s
}

export function sendWs(payload: unknown): boolean {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false
  socket.send(JSON.stringify(payload))
  return true
}
