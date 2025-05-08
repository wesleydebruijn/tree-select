import type { TreeItem, Data } from '../types';

export function createItems(
  items: Map<string, TreeItem>,
  data: Data[],
  mount: (item: TreeItem, element: HTMLElement) => void,
  element: HTMLElement,
  depth: number = 0,
  parent?: TreeItem
): void {
  data.forEach(record => {
    let item: TreeItem = {
      _id: `${depth}-${record.id}`,
      parent: parent?._id,
      children: record.children?.map(child => `${depth + 1}-${child.id}`),
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
    mount(item, element);

    if (record.children && item.childrenElement) {
      createItems(items, record.children, mount, item.childrenElement, depth + 1, item);
    }

    items.set(item._id, item);
  });
}

export function updateItems(
  items: Map<string, TreeItem>,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  items.forEach(item => Object.assign(item, fn instanceof Function ? fn(item) : fn));
}

export function updateItemDescendants(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.children) return;

  item.children.forEach(id => {
    const child = items.get(id);
    if (!child) return;

    Object.assign(child, fn instanceof Function ? fn(child) : fn);

    if (child.children) updateItemDescendants(items, child, fn);
  });
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

export function selectItem(items: Map<string, TreeItem>, item: TreeItem): void {
  item.checked = !item.checked;
  item.indeterminate = false;

  updateItemDescendants(items, item, { checked: item.checked, indeterminate: false });
  updateItemAscendants(items, item, item => propagateItem(items, item));
}

export function propagateItem(items: Map<string, TreeItem>, item: TreeItem): void {
  if (!item.children) return;

  const children = item.children.map(id => items.get(id)!);
  const allChecked = children.every(child => child.checked);
  const someChecked = children.some(child => child.checked || child.indeterminate);

  item.checked = allChecked;
  item.indeterminate = !allChecked && someChecked;
}

export function populateItems(
  items: Map<string, TreeItem>,
  isChecked: (item: TreeItem) => boolean
): void {
  let parents = new Set<string>();

  updateItems(items, item => {
    const checked = isChecked(item);

    if (checked && item.parent) parents.add(item.parent);

    return { checked, indeterminate: false };
  });

  parents.forEach(id => {
    const item = items.get(id)!;

    propagateItem(items, item);
    updateItemAscendants(items, item, item => propagateItem(items, item));
  });
}
