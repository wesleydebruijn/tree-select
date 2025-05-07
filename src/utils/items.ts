import type { TreeItem } from '../types';

export function updateItems(
  items: Map<string, TreeItem>,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  items.forEach(item => Object.assign(item, fn instanceof Function ? fn(item) : fn));
}

export function updateItemChildren(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.children) return;

  item.children.forEach(id => {
    const child = items.get(id);
    if (!child) return;

    Object.assign(child, fn instanceof Function ? fn(child) : fn);

    if (child.children) updateItemChildren(items, child, fn);
  });
}

export function updateItemAncestors(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.parent) return;

  const parent = items.get(item.parent);
  if (!parent) return;

  Object.assign(parent, fn instanceof Function ? fn(parent) : fn);

  updateItemAncestors(items, parent, fn);
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
  let ancestors = new Set<string>();

  updateItems(items, item => {
    const checked = isChecked(item);

    if (checked && item.parent) ancestors.add(item.parent);

    return { checked, indeterminate: false };
  });

  ancestors.forEach(id => {
    const item = items.get(id)!;

    propagateItem(items, item);
    updateItemAncestors(items, item, item => propagateItem(items, item));
  });
}
