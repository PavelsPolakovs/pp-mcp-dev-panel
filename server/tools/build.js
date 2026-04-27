import { spawn } from "child_process";

export async function build(cwd, broadcast) {
  return new Promise((resolve, reject) => {
    broadcast({ type: "task_start", tool: "build", message: "▶ Building project..." });

    const proc = spawn("npm", ["run", "build"], {
      cwd, shell: true, env: { ...process.env, FORCE_COLOR: "0" },
    });

    proc.stdout.on("data", (d) => broadcast({ type: "output", tool: "build", data: d.toString() }));
    proc.stderr.on("data", (d) => broadcast({ type: "output", tool: "build", data: d.toString() }));

    proc.on("close", (code) => {
      const status = code === 0 ? "success" : "error";
      const message = code === 0 ? "✅ Build completed" : `❌ Build failed (exit ${code})`;
      broadcast({ type: "task_end", tool: "build", status, message });
      resolve(message);
    });
    proc.on("error", (err) => {
      broadcast({ type: "task_end", tool: "build", status: "error", message: err.message });
      reject(err);
    });
  });
}
