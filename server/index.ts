import { createServer } from 'http'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { app } from './app.ts'
import { attachWebSocket } from './ws.ts'
import { server } from './mcp.ts'
import { UI_PORT } from './config.ts'

const httpServer = createServer(app)
attachWebSocket(httpServer)

httpServer.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    process.stderr.write(`[MCP Dev Panel] Port ${UI_PORT} is already in use\n`)
    process.exit(1)
  } else {
    throw err
  }
})

httpServer.listen(UI_PORT, () => {
  process.stderr.write(`[MCP Dev Panel] UI  http://localhost:${UI_PORT}\n`)
})

const transport = new StdioServerTransport()
await server.connect(transport)
