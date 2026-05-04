import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import open from 'open'
import type { HistoryEntry } from '../shared/contracts.ts'
import { UI_PORT } from './config.ts'
import { broadcast } from './ws.ts'
import { addEntry } from './store/history.ts'
import { runAddPlan } from './tools/addPlan.ts'

export const server = new McpServer({ name: 'mcp-dev-panel', version: '1.0.0' })

server.tool('open-dashboard', 'Opens the MCP Dev Panel UI in the browser', {}, async () => {
  await open(`http://localhost:${UI_PORT}`)
  return { content: [{ type: 'text', text: `Dashboard opened at http://localhost:${UI_PORT}` }] }
})

server.tool(
  'add-plan',
  'Stores a plan file (markdown or JSON) on the dev panel server.',
  {
    fileName: z.string().describe('Plan file name, must end in .md or .json'),
    content: z.string().describe('Plan file contents')
  } as Record<string, unknown>,
  async (args: { fileName?: unknown; content?: unknown }) => {
    const fileName = typeof args.fileName === 'string' ? args.fileName : ''
    const content = typeof args.content === 'string' ? args.content : ''
    const entry: HistoryEntry = {
      correlationId: randomUUID(),
      action: 'plan_confirmed',
      initiator: { kind: 'agent', sessionId: null, userId: null },
      stage: 'queued',
      timestamp: new Date().toISOString(),
      meta: { fileName, content }
    }
    addEntry(entry)
    broadcast({ type: 'history_update', entry })
    await runAddPlan(entry)
    return { content: [{ type: 'text', text: `Plan accepted: ${fileName}` }] }
  }
)