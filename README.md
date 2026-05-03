# use-selection

React utilities for keyed selection state. It is useful for large selectable
lists where changing the selected item should update only the previously
selected row, the newly selected row, and any selected-value display.

The API is similar in spirit to Solid's `createSelector`: each row subscribes to
whether its own key is selected instead of receiving the selected key as a prop
from the parent list.

## Installation

```bash
pnpm add use-selection
```

React is a peer dependency.

## Component (Recommended)

Create one selection store for a list and use the wrapper components to subscribe
only where selected state is needed. This keeps the parent list from rerendering
when selection changes.

```tsx
import {
  createSelectionStore,
  IsSelectedKey,
  SelectedKey,
} from "use-selection";
import { useMemo } from "react";

const items = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
];

export function List() {
  const store = useMemo(() => createSelectionStore(items[0]!.id), []);

  return (
    <div>
      <SelectedKey store={store}>
        {(selectedKey) => <p>Selected: {selectedKey ?? "None"}</p>}
      </SelectedKey>

      {items.map((item) => (
        <Row
          handleSelect={store.setSelectedKey}
          item={item}
          key={item.id}
          store={store}
        />
      ))}
    </div>
  );
}

function Row({
  handleSelect,
  item,
  store,
}: {
  handleSelect: (id: string) => void;
  item: { id: string; label: string };
  store: ReturnType<typeof createSelectionStore<string>>;
}) {
  return (
    <IsSelectedKey keyValue={item.id} store={store}>
      {(isSelected) => (
        <button
          aria-pressed={isSelected}
          onClick={() => handleSelect(item.id)}
          type="button"
        >
          {item.label}
        </button>
      )}
    </IsSelectedKey>
  );
}
```

Use `keyValue` with `IsSelectedKey` because `key` is a special React prop and is
not passed through to components.

## Hooks

The hooks are exported for advanced cases, but the wrapper components are the
recommended default. Components make it harder to accidentally pull selected
state into the parent list and rerender every row.

```tsx
import {
  createSelectionStore,
  useIsSelectedKey,
  useSelectedKey,
} from "use-selection";
import { useMemo } from "react";

function HookList() {
  const store = useMemo(() => createSelectionStore("one"), []);
  const selectedKey = useSelectedKey(store);

  return (
    <div>
      <p>Selected: {selectedKey ?? "None"}</p>
      <HookRow handleSelect={store.setSelectedKey} id="one" store={store} />
      <HookRow handleSelect={store.setSelectedKey} id="two" store={store} />
    </div>
  );
}

function HookRow({
  handleSelect,
  id,
  store,
}: {
  handleSelect: (id: string) => void;
  id: string;
  store: ReturnType<typeof createSelectionStore<string>>;
}) {
  const isSelected = useIsSelectedKey(store, id);

  return (
    <button
      aria-pressed={isSelected}
      onClick={() => handleSelect(id)}
      type="button"
    >
      {id}
    </button>
  );
}
```

## API

### `createSelectionStore(initialKey?)`

Creates a selection store.

```ts
const store = createSelectionStore<string>("item-1");
```

The store exposes:

- `setSelectedKey(next)` - sets the selected key.
- `getSelectedKeySnapshot()` - returns the current selected key.
- `subscribeSelectedKey(listener)` - subscribes to selected-key changes.
- `getIsSelectedKeySnapshot(key)` - returns whether `key` is selected.
- `subscribeIsSelectedKey(key, listener)` - subscribes to changes for one key.

### `useSelectedKey(store)`

Subscribes to the selected key value.

```tsx
const selectedKey = useSelectedKey(store);
```

### `useIsSelectedKey(store, key)`

Subscribes to whether a specific key is selected.

```tsx
const isSelected = useIsSelectedKey(store, item.id);
```

### `SelectedKey`

Component wrapper around `useSelectedKey`.

```tsx
<SelectedKey store={store}>
  {(selectedKey) => <span>{selectedKey}</span>}
</SelectedKey>
```

### `IsSelectedKey`

Component wrapper around `useIsSelectedKey`.

```tsx
<IsSelectedKey keyValue={item.id} store={store}>
  {(isSelected) => <Row selected={isSelected} />}
</IsSelectedKey>
```

## Why Not Keep Selected Key In Parent State?

If a parent list stores `selectedId` in React state and passes it to every row,
each selection change rerenders the parent and gives every row a changed prop.
That is often fine for small lists, but expensive for large or complex rows.

With `use-selection`, rows subscribe by key. Updating the selected key
notifies only:

- the previously selected key
- the newly selected key
- subscribers to the selected key value

## Playground

Run the playground to compare normal React state selection with keyed
subscriptions:

```bash
pnpm run play
```

The playground shows per-row render counts so you can see the difference when
selecting items.

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run test
pnpm run build
```
