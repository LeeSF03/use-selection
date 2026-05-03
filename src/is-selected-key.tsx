import type { ReactNode } from "react";
import type { SelectionStore } from "./selection-store";
import { useIsSelectedKey } from "./use-is-selected-key";

interface IsSelectedKeyProps<T> {
  children: (isSelectedKey: boolean) => ReactNode;
  keyValue: T;
  store: SelectionStore<T>;
}

export function IsSelectedKey<T>({
  children,
  keyValue,
  store,
}: IsSelectedKeyProps<T>) {
  return children(useIsSelectedKey(store, keyValue));
}
