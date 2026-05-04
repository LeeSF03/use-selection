# @leesf/use-selection

React utilities for keyed selection state. It is useful for large selectable
lists where changing the selected item should update only the previously
selected row, the newly selected row, and any selected-value display.

The API is similar in spirit to Solid's `createSelector`: each row subscribes to
whether its own key is selected instead of receiving the selected key as a prop
from the parent list.

## Installation

```bash
npm install @leesf/use-selection
```

```bash
yarn add @leesf/use-selection
```

```bash
pnpm add @leesf/use-selection
```

```bash
bun add @leesf/use-selection
```

React is a peer dependency.

## Components (Recommended)

Use `SelectionProvider` with `SelectedKey` and `IsSelectedKey` when you do not
want to pass the store through every row. This is the recommended path for list
UIs because selected state stays local to the components that actually need it.

```tsx
import {
  IsSelectedKey,
  SelectionProvider,
  SelectedKey,
  useSelectionStore,
} from "@leesf/use-selection";

const items = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
];

export function List() {
  return (
    <SelectionProvider initialKey={items[0]!.id}>
      <SelectedKey>
        {(selectedKey) => (
          <p>Selected: {(selectedKey as string | null) ?? "None"}</p>
        )}
      </SelectedKey>

      {items.map((item) => (
        <Row item={item} key={item.id} />
      ))}
    </SelectionProvider>
  );
}

function Row({ item }: { item: { id: string; label: string } }) {
  const store = useSelectionStore();

  return (
    <IsSelectedKey keyValue={item.id}>
      {(isSelected) => (
        <button
          aria-pressed={isSelected}
          onClick={() => store.setSelectedKey(item.id)}
          type="button"
        >
          {item.label}
        </button>
      )}
    </IsSelectedKey>
  );
}
```

You can also provide a store directly when you want to own it outside the
provider:

```tsx
const store = createSelectionStore("one");

<SelectionProvider store={store}>
  <SelectedKey>{(selectedKey) => selectedKey}</SelectedKey>
</SelectionProvider>;
```

Use `keyValue` with `IsSelectedKey` because `key` is a special React prop and is
not passed through to components.

## Without Provider

You can pass a store directly to the wrapper components. This avoids context and
keeps TypeScript inference from the store.

```tsx
import {
  createSelectionStore,
  IsSelectedKey,
  SelectedKey,
} from "@leesf/use-selection";
import { useMemo } from "react";

const items = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
];

function ListWithoutProvider() {
  const store = useMemo(() => createSelectionStore(items[0]!.id), []);

  return (
    <div>
      <SelectedKey store={store}>
        {(selectedKey) => <p>Selected: {selectedKey ?? "None"}</p>}
      </SelectedKey>

      {items.map((item) => (
        <IsSelectedKey key={item.id} keyValue={item.id} store={store}>
          {(isSelected) => (
            <button
              aria-pressed={isSelected}
              onClick={() => store.setSelectedKey(item.id)}
              type="button"
            >
              {item.label}
            </button>
          )}
        </IsSelectedKey>
      ))}
    </div>
  );
}
```

In this example, `selectedKey` is inferred as `string | null` because `store` is
`SelectionStore<string>`.

## Hooks

The hooks are exported for advanced cases, but the wrapper components are the
recommended default. Components make it harder to accidentally pull selected
state into the parent list and rerender every row.

```tsx
import {
  createSelectionStore,
  useIsSelectedKey,
  useSelectedKey,
} from "@leesf/use-selection";
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

### `SelectionProvider`

Provides a selection store to `SelectedKey`, `IsSelectedKey`, and
`useSelectionStore`.

Create an internal store:

```tsx
<SelectionProvider initialKey="item-1">{children}</SelectionProvider>
```

Provide an existing store:

```tsx
const store = createSelectionStore("item-1");

<SelectionProvider store={store}>{children}</SelectionProvider>;
```

`initialKey` is only used when the provider creates its internal store.

### `useSelectionStore()`

Reads the nearest `SelectionProvider`.

```tsx
const store = useSelectionStore();
```

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

With `@leesf/use-selection`, rows subscribe by key. Updating the selected key
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

Build and preview the production playground:

```bash
pnpm run play:build
pnpm run play:preview
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
