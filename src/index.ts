import { defaults, classNames as cls } from './constants';
import { debounce, create, visible } from './utils/global';
import { getInputElement, getInputValues, setInputValues } from './utils/input';
import {
  createItems,
  updateItems,
  updateItemDescendants,
  updateItemAscendants,
  propagateItem,
  populateItems,
} from './utils/items';

import type { TreeItem, TreeSettings, Data } from './types';

declare global {
  interface HTMLElement {
    treeSelect: TreeSelect | null;
  }
}

export class TreeSelect {
  public settings: TreeSettings;

  public opened: boolean = false;
  public loaded: boolean = false;
  public loading: boolean = false;
  public mounted: boolean = false;
  public search: string = '';

  public data: Data[] = [];
  public selected: string[] = [];

  public items: Map<string, TreeItem> = new Map();
  public depth: number = 0;

  public inputElement: HTMLInputElement | HTMLSelectElement;
  public wrapperElement: HTMLElement | null = null;
  public searchElement: HTMLInputElement | null = null;
  public dropdownElement: HTMLElement | null = null;
  public listElement: HTMLElement | null = null;

  constructor(
    input: HTMLInputElement | HTMLSelectElement | string,
    settings: Partial<TreeSettings> = {}
  ) {
    this.settings = { ...defaults, ...settings };
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.mountItem = this.mountItem.bind(this);

    // initialize the root input element
    this.inputElement = getInputElement(input);

    if (this.inputElement.treeSelect)
      throw new Error('TreeSelect already initialized on this element');

    this.inputElement.treeSelect = this;
    this.inputElement.addEventListener('change', this.onChange);

    this.data = this.settings.data || [];
    this.selected = getInputValues(this.inputElement, this.settings.delimiter);

    this.mount();

    if (this.settings.open) this.open();
  }

  public open(): void {
    if (this.opened) return;
    if (!this.loaded && !this.loading) this.load();

    this.opened = true;
    visible(this.dropdownElement, true);

    this.onOpen();
  }

  public close(): void {
    if (!this.opened) return;

    this.opened = false;
    visible(this.dropdownElement, false);

    this.onClose();
  }

  public async load(): Promise<void> {
    if (!this.settings.src) return this.onLoad();

    return fetch(this.settings.src)
      .then(response => response.json())
      .then((data: Data[]) => {
        this.data = data;
        this.onLoad();
      });
  }

  public destroy(): void {
    document.removeEventListener('mousedown', this.onFocus, true);
    document.removeEventListener('focus', this.onFocus, true);

    if (this.wrapperElement) this.wrapperElement.remove();

    visible(this.inputElement, true);

    this.inputElement.treeSelect = null;
    this.inputElement.removeEventListener('change', this.onChange);
  }

  private mount(): void {
    // create the wrapper element
    this.wrapperElement = create('div', [cls.wrapper, this.settings.wrapperClassName]);
    this.wrapperElement.addEventListener('keydown', this.onKeyDown);
    this.inputElement.after(this.wrapperElement);

    // create the search element
    this.searchElement = create('input', [cls.search, this.settings.searchClassName]);
    this.searchElement.placeholder = this.settings.placeholder;
    this.searchElement.addEventListener('keyup', debounce(this.onSearch, 100));
    this.wrapperElement.appendChild(this.searchElement);

    // create the dropdown element
    this.dropdownElement = create('div', [cls.dropdown, this.settings.dropdownClassName]);
    visible(this.dropdownElement, false);
    this.wrapperElement.appendChild(this.dropdownElement);

    // add event listeners
    document.addEventListener('mousedown', this.onFocus, true);
    document.addEventListener('focus', this.onFocus, true);

    // hide the initial input element
    visible(this.inputElement, false);
  }

  private mountItems(): void {
    // create the list element
    this.listElement = create('div', [cls.list, this.settings.listClassName]);

    // create the items
    this.items = new Map<string, TreeItem>();
    createItems(this.items, this.data, this.mountItem, this.listElement);

    // set the depth of the tree
    this.depth = Math.max(...Array.from(this.items.values()).map(item => item.depth));

    // populate the items
    populateItems(this.items, item => this.selected.includes(item.id) && item.depth === this.depth);

    this.updateDOM();

    // append the list element to the dropdown element
    if (this.dropdownElement) this.dropdownElement.appendChild(this.listElement);

    this.mounted = true;
  }

  private mountItem(item: TreeItem, element: HTMLElement) {
    // create root item element
    item.itemElement = create('div', [cls.item, this.settings.itemClassName]);

    // create checkbox element
    item.checkboxElement = create('input', [cls.itemCheckbox, this.settings.checkboxClassName]);
    item.checkboxElement.type = 'checkbox';
    item.checkboxElement.addEventListener('click', event => this.onItemSelect(event, item));

    // create collapse element
    if (item.children) {
      item.collapseElement = create('div', [cls.itemCollapse, this.settings.collapseClassName]);
      item.collapseElement.addEventListener('click', event => this.onItemCollapse(event, item));
    }

    // create label with collapse element, checkbox and name
    const labelElement = create('label', [cls.itemLabel]);
    if (item.collapseElement) labelElement.appendChild(item.collapseElement);
    labelElement.appendChild(item.checkboxElement);
    labelElement.appendChild(create('span', [], item.name));

    // append label and children element to root item element
    item.itemElement.appendChild(labelElement);
    if (item.children) {
      item.childrenElement = create('div', [cls.itemChildren]);
      item.itemElement.appendChild(item.childrenElement);
    }

    // append item element to the parent element
    element.appendChild(item.itemElement);
  }

  private updateDOM(): void {
    this.items.forEach(item => {
      visible(item.childrenElement, !item.collapsed);
      visible(item.itemElement, !item.hidden);

      if (item.collapseElement) item.collapseElement.innerHTML = item.collapsed ? '▶' : '▼';

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

    if (!this.mounted) this.mountItems();

    if (this.settings.onLoad) this.settings.onLoad(this.data);
  }

  private onItemSelect(_event: Event, item: TreeItem): void {
    item.checked = !item.checked;
    item.indeterminate = false;

    updateItemDescendants(this.items, item, { checked: item.checked, indeterminate: false });
    updateItemAscendants(this.items, item, item => propagateItem(this.items, item));

    this.selected = Array.from(this.items.values())
      .filter(item => item.checked && item.depth === this.depth)
      .map(item => item.id);

    setInputValues(this.inputElement, this.selected, this.settings.delimiter);

    this.updateDOM();

    if (this.settings.onSelect) this.settings.onSelect(this.selected);
  }

  private onItemCollapse(event: Event, item: TreeItem): void {
    event.preventDefault();

    item.collapsed = !item.collapsed;

    this.updateDOM();
  }

  private onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    if (search === this.search) return;

    this.search = search;

    if (this.search.length === 0) {
      updateItems(this.items, { hidden: false, collapsed: true });
    } else {
      updateItems(this.items, { hidden: true, collapsed: false });
      updateItems(this.items, item => {
        const match = item.name.toLowerCase().includes(this.search.toLowerCase());
        if (!match) return;

        item.hidden = false;

        updateItemDescendants(this.items, item, { hidden: false });
        updateItemAscendants(this.items, item, { hidden: false });
      });
    }

    this.updateDOM();

    if (this.settings.onSearch) this.settings.onSearch(search);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.close();
  }

  private onOpen(): void {
    if (this.settings.onOpen) this.settings.onOpen();
  }

  private onClose(): void {
    if (this.settings.onClose) this.settings.onClose();
  }

  private onFocus(event: Event): void {
    if (this.wrapperElement?.contains(event.target as HTMLElement)) {
      this.open();
    } else {
      this.close();
    }
  }

  private onChange(_event: Event): void {
    this.selected = getInputValues(this.inputElement, this.settings.delimiter);
    if (!this.mounted) return;

    populateItems(this.items, item => this.selected.includes(item.id) && item.depth === this.depth);

    this.updateDOM();
  }
}

export { TreeItem, TreeSettings, Data };
