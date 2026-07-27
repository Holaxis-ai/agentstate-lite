export interface DurableActivityState {
  operationEpoch: number;
  currentEpoch: number;
  visibilityState: DocumentVisibilityState;
  suspendedLaunchId: string | null;
}

export function mayForwardDurableActivity(state: DurableActivityState): boolean {
  return (
    state.operationEpoch === state.currentEpoch &&
    state.visibilityState === "visible" &&
    state.suspendedLaunchId === null
  );
}
