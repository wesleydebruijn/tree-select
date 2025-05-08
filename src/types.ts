export interface Data {
  id: string | number;
  name: string;
  children?: Data[];
}

export interface TreeItem {
  _id: string;
  id: string;
  parent?: string;
  children?: string[];
  depth: number;
  name: string;
  checked: boolean;
  indeterminate: boolean;
  collapsed: boolean;
  hidden: boolean;
  search: string;
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
  loadingText: string;
  selectedText: string;
  data?: Data[];
  src?: string;

  wrapperClassName?: string;
  controlClassName?: string;
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
  onLoad?: (data: Data[]) => void;
}
