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

export type TreeHTMLElement =
  | 'wrapper'
  | 'control'
  | 'search'
  | 'dropdown'
  | 'heading'
  | 'headingSpan'
  | 'loading'
  | 'list'
  | 'item'
  | 'checkbox'
  | 'collapse'
  | 'clear'
  | 'label'
  | 'labelSpan'
  | 'children';

export interface TreeSettings {
  open: boolean;
  delimiter: string;
  collapseDepth: number;
  checkboxDepth: number;
  searchText?: string;
  headingText?: string;
  loadingText: string;
  selectedText: string;
  clearText: string;
  data?: Data[];
  dataSrc?: string;
  html: {
    [key in TreeHTMLElement]?: { className?: string; data?: object };
  };

  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (selected: string[]) => void;
  onSearch?: (search: string) => void;
  onLoad?: (data: Data[]) => void;
  onClear?: () => void;
}
