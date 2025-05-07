export interface TreeRecord {
  id: string | number;
  name: string;
  children?: TreeRecord[];
}

export interface TreeItem {
  id: string;
  parent?: string;
  children?: string[];
  level: number;
  name: string;
  checked: boolean;
  indeterminate: boolean;
  collapsed: boolean;
  hidden: boolean;
  itemElement: HTMLElement | null;
  checkboxElement: HTMLInputElement | null;
  collapseElement: HTMLElement | null;
  childrenElement: HTMLElement | null;
}

export interface TreeSettings {
  open: boolean;
  multiple: boolean;
  placeholder: string;
  delimiter: string;
  collapsedContent: string;
  expandedContent: string;
  data?: TreeRecord[];
  src?: string;

  wrapperClassName?: string;
  searchClassName?: string;
  dropdownClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  checkboxClassName?: string;
  collapseClassName?: string;

  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (selected: string[]) => void;
  onSearch?: (search: string) => void;
  onClear?: () => void;
  onLoad?: (data: TreeRecord[]) => void;
}
