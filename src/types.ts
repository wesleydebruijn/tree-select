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
  fullName: string;
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
  placeholder: string;
  delimiter: string;
  collapseDepth: number;
  checkboxDepth: number;
  headingText?: string;
  loadingText: string;
  selectedText: string;
  clearText: string;
  data?: Data[];
  dataSrc?: string;

  wrapperClassName?: string;
  controlClassName?: string;
  searchClassName?: string;
  dropdownClassName?: string;
  headingClassName?: string;
  loadingClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  checkboxClassName?: string;
  collapseClassName?: string;
  clearClassName?: string;

  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (selected: string[]) => void;
  onSearch?: (search: string) => void;
  onLoad?: (data: Data[]) => void;
  onClear?: () => void;
}
