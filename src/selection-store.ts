export function createSelectionStore<T>(initial: T | null = null) {
  let selected: T | null = initial;
  const listeners = new Map<T, Set<() => void>>();

  function notify(key: T) {
    listeners.get(key)?.forEach((listener) => listener());
  }

  return {
    getSelected() {
      return selected;
    },

    setSelected(next: T) {
      if (Object.is(selected, next)) return;

      const prev = selected;
      selected = next;

      if (prev) notify(prev);
      notify(next);
    },

    subscribe(key: T, listener: () => void) {
      let set = listeners.get(key);

      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }

      set.add(listener);

      return () => {
        set!.delete(listener);

        if (set!.size === 0) {
          listeners.delete(key);
        }
      };
    },

    getIsSelectedSnapshot(key: T) {
      return Object.is(selected, key);
    },
  };
}

export type SelectionStore<T> = ReturnType<typeof createSelectionStore<T>>;
