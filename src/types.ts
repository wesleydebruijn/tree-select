import type { TreeSelect } from "./tree-select";

declare global {
  interface HTMLInputElement {
    treeSelect?: TreeSelect | null;
  }

  interface HTMLSelectElement {
    treeSelect?: TreeSelect | null;
  }
}

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
  | "wrapper"
  | "control"
  | "search"
  | "dropdown"
  | "loading"
  | "list"
  | "item"
  | "checkbox"
  | "collapse"
  | "clear"
  | "label"
  | "labelSpan"
  | "children";

export interface TreeSettings {
  open: boolean;
  clearable: boolean;
  searchable: boolean;
  collapsible: boolean;
  depthCollapsible: number;
  depthCollapsed: number;
  depthCheckboxes: number;
  depthValues: number | "last";
  delimiter: string;
  data?: Data[];
  dataSrc?: string;
  focus: string;
  text: {
    selected?: string;
    loading?: string;
    search?: string;
  };
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
