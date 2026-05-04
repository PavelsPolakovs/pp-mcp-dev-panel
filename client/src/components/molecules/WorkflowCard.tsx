import { useTranslation } from 'react-i18next'
import { BaseCard, StatusBadge } from '@atoms'
import type { StatusBadgeVariant } from '@atoms/StatusBadge'
import { useStore } from '@store/useStore'
import type { CtaState, StepStatus, WorkflowStepConfig } from '@config/workflow'
import { WORKFLOW_CONFIG } from '@config/workflow'

export interface WorkflowCardProps {
  step: WorkflowStepConfig
}

function findBlockingStep(
  step: WorkflowStepConfig,
  steps: Record<string, StepStatus>
): WorkflowStepConfig | null {
  for (const depId of step.dependsOn) {
    if (steps[depId] !== 'done') {
      return WORKFLOW_CONFIG.find((s) => s.id === depId) ?? null
    }
  }
  return null
}

export default function WorkflowCard({ step }: WorkflowCardProps) {
  const { t } = useTranslation()
  const status = useStore((s) => s.workflowSteps[step.id] ?? 'idle')
  const allSteps = useStore((s) => s.workflowSteps)
  const openModal = useStore((s) => s.openModal)
  const openDrawer = useStore((s) => s.openDrawer)

  const blocking = findBlockingStep(step, allSteps)
  const locked = blocking !== null
  const badgeVariant: StatusBadgeVariant = locked ? 'locked' : status
  const cta: CtaState | undefined = step.ctaConfig[status]
  const tooltip = locked ? t('workflows.locked.tooltip', { step: blocking?.step }) : undefined

  const onCtaClick = () => {
    if (!cta || locked) return
    if (cta.actionType === 'modal' && cta.targetId) openModal(cta.targetId)
    else if (cta.actionType === 'drawer' && cta.targetId) openDrawer(cta.targetId)
  }

  const ctaDisabled = locked || !cta || cta.actionType === 'none'

  return (
    <BaseCard
      icon={step.icon}
      iconColorClass={step.iconColorClass}
      title={t(step.titleKey)}
      description={t(step.descriptionKey)}
      statusBadge={<StatusBadge variant={badgeVariant} />}
      dimmed={locked}
      tooltip={tooltip}
      ctaSlot={
        cta ? (
          <button
            type="button"
            onClick={onCtaClick}
            disabled={ctaDisabled}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              ctaDisabled
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
            }`}
          >
            {t(cta.labelKey)}
          </button>
        ) : null
      }
    />
  )
}
