import type { TreeItem, TreeRecord, TreeSettings } from './types';
import {
  createWrapper,
  createSearch,
  createDropdown,
  createList,
  createItem,
  createItemChildren,
  createCheckbox,
  createCollapse,
  show,
  hide,
} from './utils/dom';

declare global {
  interface HTMLElement {
    treeselect: TreeSelect | null;
  }
}

const defaults: TreeSettings = {
  open: true,
  multiple: false,
  searchable: false,
  clearable: false,
  collapsable: false,
  checkable: false,
  openLevel: 0,
  checkboxLevel: 0,
  placeholder: 'Search...',
  delimiter: ',',
};

export class TreeSelect {
  public settings: TreeSettings;

  public input: HTMLInputElement | HTMLSelectElement;
  public selected: string[] = [];

  public data: TreeRecord[] = [];
  public dataLoaded: boolean = false;

  public items: Map<string, TreeItem> = new Map();
  public itemsLoaded: boolean = false;
  public itemsRendered: boolean = false;
  public itemLevels: number = 0;

  public wrapperElement: HTMLElement | null = null;
  public searchElement: HTMLInputElement | null = null;
  public dropdownElement: HTMLElement | null = null;
  public listElement: HTMLElement | null = null;

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

    this.data = this.settings.data || [];
    this.dataLoaded = !this.settings.src;

    this.mount();

    if (this.settings.open) this.open();
  }

  open(): void {
    if (!this.dataLoaded) this.load();
    if (!this.itemsLoaded) this.buildItems(this.data);
    if (!this.itemsRendered) this.renderItems(this.data);
  }

  close(): void {
    if (this.settings.onClose) this.settings.onClose();
  }

  async load(): Promise<void> {
    if (!this.settings.src) return;

    fetch(this.settings.src)
      .then(response => response.json())
      .then((data: TreeRecord[]) => {
        this.data = data;
        this.dataLoaded = true;

        if (this.settings.onLoad) this.settings.onLoad(this.data);

        this.buildItems(this.data);
        this.renderItems(this.data);
      });
  }

  buildItems(data: TreeRecord[], level: number = 0, parent?: string): void {
    if (level > this.itemLevels) this.itemLevels = level;

    data.forEach(record => {
      const id = `${level}-${record.id}`;

      this.items.set(id, {
        id,
        parent,
        children: record.children?.map(child => `${level + 1}-${child.id}`),
        level,
        name: record.name,
        checked: false,
        indeterminate: false,
        collapsed: level > this.settings.openLevel,
        hidden: false,
        itemElement: null,
        checkboxElement: null,
        collapseElement: null,
      });

      if (record.children) {
        this.buildItems(record.children, level + 1, id);
      }
    });
  }

  mount(): void {
    this.wrapperElement = createWrapper(this.settings.wrapperClassName);
    this.input.after(this.wrapperElement);

    this.searchElement = createSearch(this.settings.searchClassName || this.input.className);
    this.searchElement.placeholder = this.settings.placeholder;
    this.wrapperElement.appendChild(this.searchElement);

    this.dropdownElement = createDropdown(this.settings.dropdownClassName);
    this.wrapperElement.appendChild(this.dropdownElement);

    this.listElement = createList(this.settings.listClassName);
    this.dropdownElement.appendChild(this.listElement);

    hide(this.input);
  }

  renderItems(
    data: TreeRecord[],
    level: number = 0,
    parent: HTMLElement | null = this.listElement
  ): void {
    if (this.itemsRendered) return;

    data.forEach(record => {
      const id = `${level}-${record.id}`;
      const item = this.items.get(id);

      if (!item) return;

      const itemElement = createItem(this.settings.itemClassName);
      const checkboxElement = createCheckbox(this.settings.checkboxClassName);
      const collapseElement = createCollapse(this.settings.collapseClassName);

      itemElement.appendChild(collapseElement);
      itemElement.appendChild(checkboxElement);
      itemElement.appendChild(document.createTextNode(record.name));

      item.itemElement = itemElement;
      item.checkboxElement = checkboxElement;
      item.collapseElement = collapseElement;

      if (parent) parent.appendChild(itemElement);

      if (record.children) {
        const container = createItemChildren();
        itemElement.appendChild(container);

        this.renderItems(record.children, level + 1, container);
      }
    });
  }

  destroy(): void {
    this.input.treeselect = null;
    if (this.wrapperElement) this.wrapperElement.remove();
    show(this.input);
  }
}

export { TreeItem, TreeRecord, TreeSettings };
