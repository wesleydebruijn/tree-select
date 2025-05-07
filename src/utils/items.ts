import type { TreeItem } from '../types';

export function select(items: Map<string, TreeItem>, item: TreeItem, checked: boolean): void {
  item.checked = checked;
  item.indeterminate = false;

  updateChildren(items, item, { checked, indeterminate: false });
  updateAncestors(items, item, ancestor => {
    if (!ancestor.children) return;

    const children = ancestor.children.map(id => items.get(id)!);
    const allChecked = children.every(child => child.checked);
    const someChecked = children.some(child => child.checked || child.indeterminate);

    ancestor.checked = allChecked;
    ancestor.indeterminate = !allChecked && someChecked;
  });
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
