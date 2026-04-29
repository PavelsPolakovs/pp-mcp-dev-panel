import { spawn } from 'child_process';

export async function lint(cwd: string, broadcast: (payload: unknown) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    broadcast({ type: 'task_start', tool: 'lint', message: '▶ Running ESLint...' });

    const proc = spawn('npx', ['eslint', '.', '--ext', '.js,.jsx,.ts,.tsx'], {
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    proc.stdout.on('data', (d) => broadcast({ type: 'output', tool: 'lint', data: d.toString() }));
    proc.stderr.on('data', (d) => broadcast({ type: 'output', tool: 'lint', data: d.toString() }));

    proc.on('close', (code) => {
      const status = code === 0 ? 'success' : 'warning';
      const message = code === 0 ? '✅ No lint errors' : `⚠️ Lint issues found (exit ${code})`;
      broadcast({ type: 'task_end', tool: 'lint', status, message });
      resolve(message);
    });
    proc.on('error', (err) => {
      broadcast({ type: 'task_end', tool: 'lint', status: 'error', message: err.message });
      reject(err);
    });
  });
}
