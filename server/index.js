import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import open from "open";
import { z } from "zod";
import { runTests } from "./tools/runTests.js";
import { build } from "./tools/build.js";
import { lint } from "./tools/lint.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────
const UI_PORT = process.env.UI_PORT || 3333;
const PROJECT_DIR = process.env.PROJECT_DIR || join(__dirname, "..");

// ─── Express + HTTP ───────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const clientDist = join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => res.sendFile(join(clientDist, "index.html")));

const httpServer = createServer(app);

// ─── WebSocket ────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: "connected", message: "MCP Dev Panel connected" }));
  ws.on("close", () => clients.delete(ws));
});

function broadcast(payload) {
  const msg = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

// ─── REST API bridge ──────────────────────────
app.post("/api/run-tool", async (req, res) => {
  const { tool, projectDir } = req.body;
  const cwd = projectDir || PROJECT_DIR;
  try {
    let result;
    if (tool === "run-tests") result = await runTests(cwd, broadcast);
    else if (tool === "build") result = await build(cwd, broadcast);
    else if (tool === "lint")  result = await lint(cwd, broadcast);
    else return res.status(400).json({ error: `Unknown tool: ${tool}` });
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/status", (_req, res) => {
  res.json({ status: "ok", projectDir: PROJECT_DIR, port: UI_PORT });
});

httpServer.listen(UI_PORT, () => {
  process.stderr.write(`[MCP Dev Panel] UI → http://localhost:${UI_PORT}\n`);
});

// ─── MCP Server ───────────────────────────────
const server = new McpServer({ name: "mcp-dev-panel", version: "1.0.0" });

server.tool("open-dashboard", "Opens the MCP Dev Panel UI in the browser", {}, async () => {
  await open(`http://localhost:${UI_PORT}`);
  return { content: [{ type: "text", text: `Dashboard opened at http://localhost:${UI_PORT}` }] };
});

server.tool(
  "run-tests",
  "Runs npm test in the project directory and streams output to the dashboard",
  { projectDir: z.string().optional().describe("Absolute path to the project.") },
  async ({ projectDir }) => {
    const result = await runTests(projectDir || PROJECT_DIR, broadcast);
    return { content: [{ type: "text", text: result }] };
  }
);

server.tool(
  "build-project",
  "Runs npm run build and streams output to the dashboard",
  { projectDir: z.string().optional().describe("Absolute path to the project.") },
  async ({ projectDir }) => {
    const result = await build(projectDir || PROJECT_DIR, broadcast);
    return { content: [{ type: "text", text: result }] };
  }
);

server.tool(
  "lint-project",
  "Runs ESLint on the project and streams output to the dashboard",
  { projectDir: z.string().optional().describe("Absolute path to the project.") },
  async ({ projectDir }) => {
    const result = await lint(projectDir || PROJECT_DIR, broadcast);
    return { content: [{ type: "text", text: result }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
