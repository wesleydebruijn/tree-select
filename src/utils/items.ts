import type { TreeItem } from '../types';

export function updateAll(
  items: Map<string, TreeItem>,
  fn: ((item: TreeItem) => void) | Partial<TreeItem>
): void {
  items.forEach(item => Object.assign(item, fn instanceof Function ? fn(item) : fn));
}

export function updateParentCheckedState(items: Map<string, TreeItem>, item: TreeItem): void {
  if (!item.parent) return;

  const parent = items.get(item.parent);
  if (!parent || !parent.children) return;

  const children = parent.children.map(id => items.get(id)!);
  const allChecked = children.every(child => child.checked);
  const someChecked = children.some(child => child.checked || child.indeterminate);

  parent.checked = allChecked;
  parent.indeterminate = !allChecked && someChecked;

  updateParentCheckedState(items, parent);
}

export function updateChildrenCheckedState(
  items: Map<string, TreeItem>,
  item: TreeItem,
  checked: boolean
): void {
  if (!item.children) return;

  item.children.forEach(id => {
    const child = items.get(id);
    if (!child) return;

    child.checked = checked;
    child.indeterminate = false;

    if (child.children) updateChildrenCheckedState(items, child, checked);
  });
}

export function updateChildrenVisibleState(items: Map<string, TreeItem>, item: TreeItem): void {
  if (!item.children) return;

  item.children.forEach(id => {
    const child = items.get(id);
    if (!child) return;

    child.hidden = false;

    if (child.children) updateChildrenVisibleState(items, child);
  });
}

export function updateParentVisibleState(items: Map<string, TreeItem>, item: TreeItem): void {
  if (!item.parent) return;

  const parent = items.get(item.parent);
  if (!parent) return;

  parent.hidden = false;

  updateParentVisibleState(items, parent);
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
