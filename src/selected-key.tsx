import type { ReactNode } from "react";
import type { SelectionStore } from "./selection-store";
import { useOptionalSelectionStore } from "./selection-provider";
import { useSelectedKey } from "./use-selected-key";

type SelectedKeyProps<T> = {
  children: (selectedKey: T | null) => ReactNode;
} & (
  | {
      store: SelectionStore<T>;
    }
  | {
      store?: undefined;
    }
);

export function SelectedKey<T = unknown>({
  children,
  store,
}: SelectedKeyProps<T>) {
  const contextStore = useOptionalSelectionStore();
  const resolvedStore = store ?? contextStore;

  if (!resolvedStore) {
    throw new Error(
      "SelectedKey must receive a store or be used within SelectionProvider.",
    );
  }

  return children(useSelectedKey(resolvedStore as SelectionStore<T>));
}
