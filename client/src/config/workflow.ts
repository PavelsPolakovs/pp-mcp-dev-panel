import type { ComponentType } from 'react'
import { ClipboardList, GitBranch } from 'lucide-react'

export type StepStatus = 'idle' | 'running' | 'done' | 'error'

export type CtaActionType = 'modal' | 'drawer' | 'none'

export interface CtaState {
  labelKey: string
  actionType: CtaActionType
  targetId?: string
}

export type CtaConfig = Partial<Record<StepStatus, CtaState>>

export interface WorkflowStepConfig {
  id: string
  step: number
  dependsOn: string[]
  titleKey: string
  descriptionKey: string
  icon: ComponentType<{ size?: number | string }>
  iconColorClass: string
  optional?: boolean
  ctaConfig: CtaConfig
}

export const WORKFLOW_CONFIG: WorkflowStepConfig[] = [
  {
    id: 'add-plan',
    step: 1,
    dependsOn: [],
    titleKey: 'workflows.addPlan.title',
    descriptionKey: 'workflows.addPlan.description',
    icon: ClipboardList,
    iconColorClass: 'text-purple-500',
    ctaConfig: {
      idle: {
        labelKey: 'workflows.addPlan.cta.add',
        actionType: 'modal',
        targetId: 'add-plan'
      },
      done: {
        labelKey: 'workflows.addPlan.cta.show',
        actionType: 'drawer',
        targetId: 'add-plan'
      }
    }
  },
  {
    id: 'create-branch',
    step: 2,
    dependsOn: ['add-plan'],
    titleKey: 'workflows.createBranch.title',
    descriptionKey: 'workflows.createBranch.description',
    icon: GitBranch,
    iconColorClass: 'text-emerald-500',
    ctaConfig: {
      idle: {
        labelKey: 'workflows.createBranch.cta.create',
        actionType: 'none'
      }
    }
  }
]
