import type { TreeItem } from '../types';

export function stripId(id: string): string {
  return id.split('-')[1];
}

export function update(
  items: Map<string, TreeItem>,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  items.forEach(item => Object.assign(item, fn instanceof Function ? fn(item) : fn));
}

export function updateChildren(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.children) return;

  item.children.forEach(id => {
    const child = items.get(id);
    if (!child) return;

    Object.assign(child, fn instanceof Function ? fn(child) : fn);

    if (child.children) updateChildren(items, child, fn);
  });
}

export function updateAncestors(
  items: Map<string, TreeItem>,
  item: TreeItem,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  if (!item.parent) return;

  const parent = items.get(item.parent);
  if (!parent) return;

  Object.assign(parent, fn instanceof Function ? fn(parent) : fn);

  updateAncestors(items, parent, fn);
}
