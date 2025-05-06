import type { TreeNode, TreeSettings } from './types';

declare global {
  interface HTMLElement {
    treeselect: TreeSelect | null;
  }
}

const defaults: TreeSettings = {
  multiple: false,
  searchable: false,
  clearable: false,
  collapsable: false,
  checkable: false,
  openLevel: 0,
  checkboxLevel: 0,
  placeholder: '',
  delimiter: ',',
};

export class TreeSelect {
  public settings: TreeSettings;

  public input: HTMLInputElement | HTMLSelectElement;
  public selected: string[] = [];

  constructor(
    input: HTMLInputElement | HTMLSelectElement | string,
    settings: Partial<TreeSettings> = {}
  ) {
    this.settings = { ...defaults, ...settings };

    // initialize the root input element
    this.input =
      typeof input === 'string'
        ? (document.querySelector(input) as HTMLInputElement | HTMLSelectElement)
        : input;

    if (this.input.treeselect) {
      throw new Error('TreeSelect already initialized on this element');
    }

    this.input.treeselect = this;

    // initialize the selected values from the input element
    this.selected =
      this.input instanceof HTMLInputElement
        ? this.input.value.split(this.settings.delimiter)
        : Array.from(this.input.selectedOptions).map(option => option.value);
  }

  destroy(): void {
    this.input.treeselect = null;
  }
}

export { TreeNode, TreeSettings };
