import { WorkflowCard } from '@molecules'
import { WORKFLOW_CONFIG } from '@config/workflow'

export default function WorkflowBoard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {WORKFLOW_CONFIG.map((step) => (
        <WorkflowCard key={step.id} step={step} />
      ))}
    </div>
  )
}
