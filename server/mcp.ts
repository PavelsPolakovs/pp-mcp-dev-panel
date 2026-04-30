import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import open from 'open'
import { UI_PORT, PROJECT_DIR } from './config.ts'
import { broadcast } from './ws.ts'
import { lint } from './tools/lint.ts'

export const server = new McpServer({ name: 'mcp-dev-panel', version: '1.0.0' })

server.tool('open-dashboard', 'Opens the MCP Dev Panel UI in the browser', {}, async () => {
  await open(`http://localhost:${UI_PORT}`)
  return { content: [{ type: 'text', text: `Dashboard opened at http://localhost:${UI_PORT}` }] }
})

server.tool(
  'lint-project',
  'Runs ESLint on the project and streams output to the dashboard',
  { projectDir: z.string().optional().describe('Absolute path to the project.') } as Record<
    string,
    unknown
  >,
  async ({
    projectDir
  }: {
    projectDir?: string
  }): Promise<{ content: { type: 'text'; text: string }[] }> => {
    const result = await lint(projectDir || PROJECT_DIR, broadcast)
    return { content: [{ type: 'text', text: String(result) }] }
  }
)