import { useSyncExternalStore, useCallback } from "react";
import type { SelectionStore } from "./selection-store";

export function useIsSelectedKey<T>(store: SelectionStore<T>, key: T) {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribeIsSelectedKey(key, listener),
    [store, key],
  );

  const getSnapshot = useCallback(
    () => store.getIsSelectedKeySnapshot(key),
    [store, key],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
