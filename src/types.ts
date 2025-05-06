export interface TreeNode {
  id: string | number;
  name: string;
  children?: TreeNode[];
}

export interface TreeSettings {
  multiple: boolean;
  searchable: boolean;
  clearable: boolean;
  collapsable: boolean;
  checkable: boolean;
  openLevel: number;
  checkboxLevel: number;
  placeholder: string;
  delimiter: string;
  data?: TreeNode[];
}
