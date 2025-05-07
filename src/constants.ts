import type { TreeSettings } from './types';

export const classNames = {
  wrapper: 'tree-select-wrapper',
  search: 'tree-select-search',
  dropdown: 'tree-select-dropdown',
  list: 'tree-select-list',
  item: 'tree-select-item',
  itemChildren: 'tree-select-item-children',
  itemCheckbox: 'tree-select-item-checkbox',
  itemCollapse: 'tree-select-item-collapse',
};

export const defaults: TreeSettings = {
  open: false,
  multiple: false,
  placeholder: 'Search...',
  collapsedContent: '▶',
  expandedContent: '▼',
  delimiter: ',',
};
