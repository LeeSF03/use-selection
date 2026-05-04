import { memo, useMemo, useRef, useState } from "react";
import {
  IsSelectedKey,
  SelectedKey,
  SelectionProvider,
  useSelectionStore,
} from "../../src";

interface Item {
  id: string;
  label: string;
}

const REACT_STATE_ITEMS = createItems("state");
const KEYED_STORE_ITEMS = createItems("store");

function createItems(prefix: string): Item[] {
  return Array.from({ length: 40 }, (_, index) => ({
    id: `${prefix}-item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));
}

interface ReactStateRowProps {
  item: Item;
  selectedId: string;
  onSelect: (id: string) => void;
}

const ReactStateRow = memo(function ReactStateRow({
  item,
  selectedId,
  onSelect,
}: ReactStateRowProps) {
  const renders = useRenderCount();
  const isSelected = selectedId === item.id;

  return (
    <button
      className="list-row"
      data-selected={isSelected}
      onClick={() => onSelect(item.id)}
      type="button"
    >
      <span>
        <strong>{item.label}</strong>
        <small>{item.id}</small>
      </span>
      <span className="render-count">{renders}</span>
    </button>
  );
});

interface StoreRowProps {
  item: Item;
}

const StoreRow = memo(function StoreRow({ item }: StoreRowProps) {
  return (
    <IsSelectedKey keyValue={item.id}>
      {(isSelected) => <StoreRowButton isSelected={isSelected} item={item} />}
    </IsSelectedKey>
  );
});

function StoreRowButton({
  isSelected,
  item,
}: {
  isSelected: boolean;
  item: Item;
}) {
  const renders = useRenderCount();
  const store = useSelectionStore();

  return (
    <button
      className="list-row"
      data-selected={isSelected}
      onClick={() => store.setSelectedKey(item.id)}
      type="button"
    >
      <span>
        <strong>{item.label}</strong>
        <small>{item.id}</small>
      </span>
      <span className="render-count">{renders}</span>
    </button>
  );
}

export function App() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">React list selection optimization</p>
          <h1>Normal state vs keyed selector subscriptions</h1>
        </div>
        <div className="legend">
          <span className="render-count">#</span>
          <span>row render count</span>
        </div>
      </header>

      <section className="comparison-grid">
        <ReactStateList />
        <SelectionStoreList />
      </section>
    </main>
  );
}

function ReactStateList() {
  const [selectedId, setSelectedId] = useState(REACT_STATE_ITEMS[0]!.id);

  return (
    <ListPanel
      description="Every row receives selectedId, so each selection change gives every memoized row a new prop."
      selectedId={selectedId}
      title="React state"
    >
      {REACT_STATE_ITEMS.map((item) => (
        <ReactStateRow
          item={item}
          key={item.id}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
      ))}
    </ListPanel>
  );
}

function SelectionStoreList() {
  return (
    <SelectionProvider initialKey={KEYED_STORE_ITEMS[0]!.id}>
      <ListPanel
        description="Rows subscribe by key, so only the old selected row and next selected row are notified."
        selectedId={
          <SelectedKey>
            {(selectedKey) => (selectedKey as string | null) ?? "None"}
          </SelectedKey>
        }
        title="SelectionProvider with keyed subscriptions"
      >
        {KEYED_STORE_ITEMS.map((item) => (
          <StoreRow item={item} key={item.id} />
        ))}
      </ListPanel>
    </SelectionProvider>
  );
}

function ListPanel({
  children,
  description,
  selectedId,
  title,
}: {
  children: React.ReactNode;
  description: string;
  selectedId: React.ReactNode;
  title: string;
}) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="selected-pill">{selectedId}</div>
      </div>
      <div className="list">{children}</div>
    </article>
  );
}

function useRenderCount() {
  const count = useRef(0);
  count.current += 1;

  return count.current;
}
