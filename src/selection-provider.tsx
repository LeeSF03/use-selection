import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";
import { createSelectionStore } from "./selection-store";
import type { SelectionStore } from "./selection-store";

const SelectionStoreContext = createContext<SelectionStore<unknown> | null>(
  null,
);

interface SelectionProviderProps<T> {
  children: ReactNode;
  initialKey?: T | null;
  store?: SelectionStore<T>;
}

export function SelectionProvider<T>({
  children,
  initialKey = null,
  store,
}: SelectionProviderProps<T>) {
  const internalStoreRef = useRef<SelectionStore<T> | null>(null);

  if (!store && internalStoreRef.current === null) {
    internalStoreRef.current = createSelectionStore(initialKey);
  }

  return (
    <SelectionStoreContext.Provider value={store ?? internalStoreRef.current}>
      {children}
    </SelectionStoreContext.Provider>
  );
}

export function useSelectionStore() {
  const contextStore = useOptionalSelectionStore();

  if (!contextStore) {
    throw new Error(
      "useSelectionStore must be used within SelectionProvider.",
    );
  }

  return contextStore;
}

export function useOptionalSelectionStore() {
  return useContext(SelectionStoreContext);
}
