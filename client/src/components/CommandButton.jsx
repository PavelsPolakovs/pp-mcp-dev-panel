import { Loader2 } from "lucide-react";
import { useStore } from "../store/useStore";

export default function CommandButton({ tool, label, description, icon: Icon, colorClass }) {
  const activeTask = useStore((s) => s.activeTask);
  const projectDir = useStore((s) => s.projectDir);
  const isRunning = activeTask === tool;
  const isDisabled = !!activeTask && !isRunning;

  const run = async () => {
    if (activeTask) return;
    useStore.getState().setActiveTask(tool);
    useStore.getState().clearLogs();
    try {
      await fetch("/api/run-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, projectDir: projectDir || undefined }),
      });
    } catch (err) {
      useStore.getState().addLog({
        type: "task_end", status: "error", message: `Connection error: ${err.message}`,
      });
    } finally {
      useStore.getState().setActiveTask(null);
    }
  };

  return (
    <button
      onClick={run}
      disabled={isDisabled}
      aria-busy={isRunning}
      className={`
        group flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border transition-all duration-150
        ${isRunning
          ? "border-cyan-500/50 bg-cyan-500/5 text-cyan-300 cursor-wait"
          : isDisabled
          ? "border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed"
          : `border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 cursor-pointer`
        }
      `}
    >
      <div className={`flex-shrink-0 ${isRunning ? "text-cyan-400" : isDisabled ? "text-zinc-700" : colorClass}`}>
        {isRunning
          ? <Loader2 size={18} className="animate-spin" />
          : <Icon size={18} />
        }
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="text-sm font-medium leading-tight">{label}</div>
        <div className="text-xs text-zinc-500 mt-0.5 font-mono truncate">{description}</div>
      </div>
      {isRunning && (
        <span className="text-xs text-cyan-500 animate-pulse flex-shrink-0">running…</span>
      )}
    </button>
  );
}
