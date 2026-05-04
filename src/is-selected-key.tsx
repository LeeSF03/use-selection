import type { ReactNode } from "react";
import type { SelectionStore } from "./selection-store";
import { useOptionalSelectionStore } from "./selection-provider";
import { useIsSelectedKey } from "./use-is-selected-key";

type IsSelectedKeyProps<T> = {
  children: (isSelectedKey: boolean) => ReactNode;
  keyValue: T;
} & (
  | {
      store: SelectionStore<T>;
    }
  | {
      store?: undefined;
    }
);

export function IsSelectedKey<T = unknown>({
  children,
  keyValue,
  store,
}: IsSelectedKeyProps<T>) {
  const contextStore = useOptionalSelectionStore();
  const resolvedStore = store ?? contextStore;

  if (!resolvedStore) {
    throw new Error(
      "IsSelectedKey must receive a store or be used within SelectionProvider.",
    );
  }

  return children(useIsSelectedKey(resolvedStore as SelectionStore<T>, keyValue));
}
