interface PlanState {
  fileName: string
  content: string
  loadedAt: string
}

let current: PlanState | null = null

export function setPlan(fileName: string, content: string): PlanState {
  current = { fileName, content, loadedAt: new Date().toISOString() }
  return current
}

export function getPlan(): PlanState | null {
  return current
}

export function clearPlan(): void {
  current = null
}