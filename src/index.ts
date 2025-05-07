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
  visible,
  remove,
} from './utils/dom';
import {
  updateAll,
  updateChildrenCheckedState,
  updateParentCheckedState,
  updateChildrenVisibleState,
  updateParentVisibleState,
} from './utils/items';
import { debounce } from './utils/global';

declare global {
  interface HTMLElement {
    treeselect: TreeSelect | null;
  }
}

const defaults: TreeSettings = {
  open: false,
  multiple: false,
  placeholder: 'Search...',
  collapsedContent: '▶',
  expandedContent: '▼',
  delimiter: ',',
};

export class TreeSelect {
  public settings: TreeSettings;

  public input: HTMLInputElement | HTMLSelectElement;
  public selected: string[] = [];

  public opened: boolean = false;

  public data: TreeRecord[] = [];
  public loaded: boolean = false;
  public loading: boolean = false;

  public items: Map<string, TreeItem> = new Map();
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

    this.mount();

    if (this.settings.open) this.open();
  }

  public mount(): void {
    this.wrapperElement = createWrapper(this.settings.wrapperClassName);
    this.wrapperElement.addEventListener('click', event => this.onClick(event));
    document.addEventListener('click', event => this.onClickOutside(event));

    this.input.after(this.wrapperElement);

    this.searchElement = createSearch(this.settings.searchClassName || this.input.className);
    this.searchElement.placeholder = this.settings.placeholder;
    this.searchElement.addEventListener(
      'keyup',
      debounce(event => this.onSearch(event), 100)
    );
    this.wrapperElement.appendChild(this.searchElement);

    this.dropdownElement = createDropdown(this.settings.dropdownClassName);
    this.wrapperElement.appendChild(this.dropdownElement);

    hide(this.input);
  }

  public open(): void {
    if (this.opened) return;
    if (!this.loaded && !this.loading) this.load();

    this.opened = true;
    show(this.dropdownElement);

    this.onOpen();
  }

  public close(): void {
    if (!this.opened) return;

    this.opened = false;
    hide(this.dropdownElement);

    this.onClose();
  }

  public async load(): Promise<void> {
    if (!this.settings.src) return this.onLoad();

    fetch(this.settings.src)
      .then(response => response.json())
      .then((data: TreeRecord[]) => {
        this.data = data;
        this.onLoad();
      });
  }

  public destroy(): void {
    document.removeEventListener('click', event => this.onClickOutside(event));
    remove(this.wrapperElement);
    show(this.input);

    this.input.treeselect = null;
  }

  private createList(): void {
    remove(this.listElement);

    this.listElement = createList(this.settings.listClassName);
    this.createItems(this.data, 0, this.listElement);
    this.updateDOM();

    if (this.dropdownElement) this.dropdownElement.appendChild(this.listElement);
  }

  private createItems(
    data: TreeRecord[],
    level: number = 0,
    parentElement?: HTMLElement | null,
    parent?: string
  ): void {
    if (level > this.itemLevels) this.itemLevels = level;

    data.forEach(record => {
      let item: TreeItem = {
        id: `${level}-${record.id}`,
        parent,
        children: record.children?.map(child => `${level + 1}-${child.id}`),
        level,
        name: record.name,
        checked: false,
        indeterminate: false,
        collapsed: true,
        hidden: false,
        itemElement: null,
        checkboxElement: null,
        collapseElement: null,
        childrenElement: null,
      };

      const itemElement = createItem(this.settings.itemClassName);
      const checkboxElement = createCheckbox(this.settings.checkboxClassName);
      checkboxElement.addEventListener('click', event => this.onItemSelect(event, item));

      itemElement.appendChild(checkboxElement);
      itemElement.appendChild(document.createTextNode(record.name));

      let collapseElement: HTMLElement | null = null;
      let childrenElement: HTMLElement | null = null;
      if (record.children) {
        collapseElement = createCollapse(this.settings.collapseClassName);
        collapseElement.addEventListener('click', event => this.onItemCollapse(event, item));
        itemElement.appendChild(collapseElement);

        childrenElement = createItemChildren();
        itemElement.appendChild(childrenElement);

        this.createItems(record.children, level + 1, childrenElement, item.id);
      }

      if (parentElement) parentElement.appendChild(itemElement);

      item.itemElement = itemElement;
      item.checkboxElement = checkboxElement;
      item.collapseElement = collapseElement;
      item.childrenElement = childrenElement;

      this.items.set(item.id, item);
    });
  }

  private updateDOM(): void {
    this.items.forEach(item => {
      visible(item.childrenElement, !item.collapsed);
      visible(item.itemElement, !item.hidden);
      if (item.collapseElement)
        item.collapseElement.innerHTML = item.collapsed
          ? this.settings.collapsedContent
          : this.settings.expandedContent;

      if (item.checkboxElement) {
        item.checkboxElement.checked = item.checked;
        item.checkboxElement.indeterminate = item.indeterminate;
      }
    });
  }

  // callbacks

  private onLoad(): void {
    this.loaded = true;
    this.loading = false;

    this.createList();

    if (this.settings.onLoad) this.settings.onLoad(this.data);
  }

  private onItemSelect(_event: Event, item: TreeItem): void {
    item.checked = !item.checked;
    item.indeterminate = false;

    updateChildrenCheckedState(this.items, item, item.checked);
    updateParentCheckedState(this.items, item);

    this.updateDOM();

    if (this.settings.onSelect) this.settings.onSelect(this.selected);
  }

  private onItemCollapse(_event: Event, item: TreeItem): void {
    item.collapsed = !item.collapsed;

    this.updateDOM();
  }

  private onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;

    if (search.length === 0) {
      updateAll(this.items, { hidden: false, collapsed: true });
    } else {
      updateAll(this.items, { hidden: true, collapsed: false });
      updateAll(this.items, item => {
        const match = item.name.toLowerCase().includes(search.toLowerCase());
        if (!match) return;

        item.hidden = false;

        updateChildrenVisibleState(this.items, item);
        updateParentVisibleState(this.items, item);
      });
    }

    this.updateDOM();

    if (this.settings.onSearch) this.settings.onSearch(search);
  }

  private onClear(): void {
    if (this.settings.onClear) this.settings.onClear();
  }

  private onOpen(): void {
    if (this.settings.onOpen) this.settings.onOpen();
  }

  private onClose(): void {
    if (this.settings.onClose) this.settings.onClose();
  }

  private onClick(_event: Event): void {
    this.open();
  }

  private onClickOutside(event: Event): void {
    if (this.wrapperElement?.contains(event.target as Node)) return;

    this.close();
  }
}

export { TreeItem, TreeRecord, TreeSettings };
