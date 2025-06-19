import type { Data, TreeItem } from "../types";

export function createItems(
  items: Map<string, TreeItem>,
  data: Data[],
  depth = 0,
  parent?: TreeItem
): void {
  for (const record of data) {
    const item: TreeItem = {
      _id: `${depth}-${record.id}`,
      parent: parent?._id,
      children: record.children?.map((child) => `${depth + 1}-${child.id}`),
      depth,
      id: `${record.id}`,
      name: record.name,
      fullName: parent ? `${parent.fullName} ${record.name}` : record.name,
      checked: false,
      indeterminate: false,
      collapsed: true,
      hidden: false,
      itemElement: null,
      checkboxElement: null,
      collapseElement: null,
      childrenElement: null,
    };

    if (record.children) createItems(items, record.children, depth + 1, item);

    items.set(item._id, item);
  }
}

export function itemAscendants(
  items: Map<string, TreeItem>,
  item: TreeItem,
  ascendants: TreeItem[] = []
): TreeItem[] {
  if (!item.parent) return ascendants;

  const parent = items.get(item.parent);
  if (!parent) return ascendants;

  ascendants.push(parent);
  return itemAscendants(items, parent, ascendants);
}

export function itemsDepth(items: Map<string, TreeItem>): number {
  return Math.max(...Array.from(items.values()).map(({ depth }) => depth));
}

export function itemValues(
  items: Map<string, TreeItem>,
  minDepth: number
): string[] {
  return Array.from(items.values())
    .filter((item) => item.checked && item.depth >= minDepth)
    .map((item) => item.id);
}

export function populateItems(
  items: Map<string, TreeItem>,
  isChecked: (item: TreeItem) => boolean
): void {
  const parents = new Set<string>();

  updateItems(items, (item) => {
    const checked = isChecked(item);

    if (checked && item.parent) parents.add(item.parent);

    return { checked, indeterminate: false };
  });

  for (const id of parents) {
    const item = items.get(id);
    if (!item) continue;

    propagateItem(items, item);
    updateItemAscendants(items, item, (item) => propagateItem(items, item));
  }
}

export function propagateItem(
  items: Map<string, TreeItem>,
  item: TreeItem
): void {
  if (!item.children) return;

  const children = item.children
    .map((id) => items.get(id))
    .filter((child): child is TreeItem => child !== undefined);
  const allChecked = children.every((child) => child.checked);
  const someChecked = children.some(
    (child) => child.checked || child.indeterminate
  );

  item.checked = allChecked;
  item.indeterminate = !allChecked && someChecked;
}

export function searchItems(
  items: Map<string, TreeItem>,
  search: string
): void {
  if (search.length === 0) {
    updateItems(items, { hidden: false, collapsed: true });
  } else {
    updateItems(items, { hidden: true, collapsed: true });
    updateItems(items, (item) => {
      const match = item.fullName.toLowerCase().includes(search.toLowerCase());
      if (!match) return;

      item.hidden = false;

      updateItemDescendants(items, item, { hidden: false });
      updateItemAscendants(items, item, {
        hidden: false,
        collapsed: false,
      });
    });
  }
}

export function selectItem(items: Map<string, TreeItem>, item: TreeItem): void {
  item.checked = !item.checked;
  item.indeterminate = false;

  updateItemDescendants(items, item, {
    checked: item.checked,
    indeterminate: false,
  });
  updateItemAscendants(items, item, (item) => propagateItem(items, item));
}

export function selectItemRange(
  items: Map<string, TreeItem>,
  from: TreeItem,
  to: TreeItem
): void {
  const itemsAtDepth = Array.from(items.values()).filter(
    (item) => item.depth === to.depth
  );

  const currentIndex = itemsAtDepth.indexOf(to);
  const lastIndex = itemsAtDepth.indexOf(from);

  const start = Math.min(currentIndex, lastIndex);
  const end = Math.max(currentIndex, lastIndex);
  const itemsToUpdate = itemsAtDepth.slice(
    start === currentIndex ? start : start + 1,
    end === currentIndex ? end + 1 : end
  );

  for (const item of itemsToUpdate) {
    selectItem(items, item);
  }
}

export function selectItemsByValues(
  items: Map<string, TreeItem>,
  values: string[],
  minDepth: number
): void {
  populateItems(
    items,
    (item) => values.includes(item.id) && item.depth >= minDepth
  );
}

export function updateItemAscendants(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.parent) return;

  const parent = items.get(item.parent);
  if (!parent) return;

  Object.assign(parent, fn instanceof Function ? fn(parent) : fn);

  updateItemAscendants(items, parent, fn);
}

export function updateItemDescendants(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.children) return;

  for (const id of item.children) {
    const child = items.get(id);
    if (!child) continue;

    Object.assign(child, fn instanceof Function ? fn(child) : fn);

    if (child.children) updateItemDescendants(items, child, fn);
  }
}

export function updateItems(
  items: Map<string, TreeItem>,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  for (const item of items.values()) {
    Object.assign(item, fn instanceof Function ? fn(item) : fn);
  }
}
