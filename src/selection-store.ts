export function createSelectionStore<T>(initialKey: T | null = null) {
  let selectedKey: T | null = initialKey;
  const isSelectedKeyListeners = new Map<T, Set<() => void>>();
  const selectedKeyListeners = new Set<() => void>();

  function notify(key: T) {
    isSelectedKeyListeners.get(key)?.forEach((listener) => listener());
  }

  function notifySelectedKey() {
    selectedKeyListeners.forEach((listener) => listener());
  }

  return {
    subscribeSelectedKey(listener: () => void) {
      selectedKeyListeners.add(listener);

      return () => {
        selectedKeyListeners.delete(listener);
      };
    },

    getSelectedKeySnapshot() {
      return selectedKey;
    },

    setSelectedKey(next: T) {
      if (Object.is(selectedKey, next)) return;

      const prev = selectedKey;
      selectedKey = next;

      if (prev !== null) notify(prev);
      notify(next);
      notifySelectedKey();
    },

    subscribeIsSelectedKey(key: T, listener: () => void) {
      let set = isSelectedKeyListeners.get(key);

      if (!set) {
        set = new Set();
        isSelectedKeyListeners.set(key, set);
      }

      set.add(listener);

      return () => {
        set!.delete(listener);

        if (set!.size === 0) {
          isSelectedKeyListeners.delete(key);
        }
      };
    },

    getIsSelectedKeySnapshot(key: T) {
      return Object.is(selectedKey, key);
    },
  };
}

export type SelectionStore<T> = ReturnType<typeof createSelectionStore<T>>;
