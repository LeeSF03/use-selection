import { useSyncExternalStore, useCallback } from "react";
import type { SelectionStore } from "./selection-store";

export function useSelectedKey<T>(store: SelectionStore<T>) {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribeSelectedKey(listener),
    [store],
  );

  const getSnapshot = useCallback(
    () => store.getSelectedKeySnapshot(),
    [store],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
