import { spawn } from 'child_process';

export async function runTests(cwd, broadcast) {
  return new Promise((resolve, reject) => {
    broadcast({ type: 'task_start', tool: 'run-tests', message: '▶ Running tests...' });

    const proc = spawn('npm', ['test', '--', '--watchAll=false'], {
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    proc.stdout.on('data', (d) =>
      broadcast({ type: 'output', tool: 'run-tests', data: d.toString() }),
    );
    proc.stderr.on('data', (d) =>
      broadcast({ type: 'output', tool: 'run-tests', data: d.toString() }),
    );

    proc.on('close', (code) => {
      const status = code === 0 ? 'success' : 'error';
      const message = code === 0 ? '✅ Tests passed' : `❌ Tests failed (exit ${code})`;
      broadcast({ type: 'task_end', tool: 'run-tests', status, message });
      resolve(message);
    });
    proc.on('error', (err) => {
      broadcast({ type: 'task_end', tool: 'run-tests', status: 'error', message: err.message });
      reject(err);
    });
  });
}
