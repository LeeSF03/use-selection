import type { ReactNode } from "react";
import type { SelectionStore } from "./selection-store";
import { useSelectedKey } from "./use-selected-key";

interface SelectedKeyProps<T> {
  children: (selectedKey: T | null) => ReactNode;
  store: SelectionStore<T>;
}

export function SelectedKey<T>({ children, store }: SelectedKeyProps<T>) {
  return children(useSelectedKey(store));
}
