import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import open from 'open'
import { UI_PORT } from './config.ts'

export const server = new McpServer({ name: 'mcp-dev-panel', version: '1.0.0' })

server.tool('open-dashboard', 'Opens the MCP Dev Panel UI in the browser', {}, async () => {
  await open(`http://localhost:${UI_PORT}`)
  return { content: [{ type: 'text', text: `Dashboard opened at http://localhost:${UI_PORT}` }] }
})