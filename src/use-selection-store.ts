import { useSyncExternalStore, useCallback } from "react";
import type { SelectionStore } from "./selection-store";

export function useSelectionStore<T>(store: SelectionStore<T>, key: T) {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(key, listener),
    [store, key],
  );

  const getSnapshot = useCallback(
    () => store.getIsSelectedSnapshot(key),
    [store, key],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
