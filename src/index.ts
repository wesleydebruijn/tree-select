import { debounce, className, create, visible } from './utils/dom';
import { getInputElement, getInputValues, setInputValues } from './utils/input';
import {
  createItems,
  updateItems,
  updateItemDescendants,
  updateItemAscendants,
  selectItem,
  populateItems,
} from './utils/items';

import type { TreeItem, TreeSettings, Data } from './types';

declare global {
  interface HTMLElement {
    treeSelect: TreeSelect | null;
  }
}

export class TreeSelect {
  public settings: TreeSettings = {
    open: false,
    delimiter: ',',
    loadingText: 'Loading...',
    selectedText: 'selected',
    clearText: 'clear',
    collapseDepth: 0,
    checkboxDepth: 0,
    html: {},
  };

  public opened: boolean = false;
  public loaded: boolean = false;
  public loading: boolean = false;
  public mounted: boolean = false;
  public search: string = '';

  public data: Data[] = [];
  public selected: string[] = [];

  public items: Map<string, TreeItem> = new Map();
  public depth: number = 0;

  public lastSelectedItem: TreeItem | null = null;

  private rootElement: HTMLInputElement | HTMLSelectElement;
  private controlElement: HTMLElement | null = null;
  private wrapperElement: HTMLElement | null = null;
  private dropdownElement: HTMLElement | null = null;
  private loadingElement: HTMLElement | null = null;

  constructor(
    input: HTMLInputElement | HTMLSelectElement | string,
    settings: Partial<TreeSettings> = {}
  ) {
    this.settings = Object.assign(this.settings, settings);

    this.onLoad = this.onLoad.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClear = this.onClear.bind(this);
    this.mountItem = this.mountItem.bind(this);
    this.renderItem = this.renderItem.bind(this);

    // initialize the root input element
    this.rootElement = getInputElement(input);
    this.rootElement.treeSelect = this;
    this.rootElement.addEventListener('change', this.onChange);

    // initialize the selected values
    this.selected = getInputValues(this.rootElement, this.settings.delimiter);

    // mount initial HTML to the DOM, without fetching data or rendering tree
    this.initMount();

    if (this.settings.open) this.open();
  }

  public open(): void {
    if (this.opened) return;
    if (!this.loaded && !this.loading) debounce(() => this.load(), 0)();

    this.opened = true;
    className(this.controlElement, 'focus', true);
    visible(this.dropdownElement, true);

    this.onOpen();
  }

  public close(): void {
    if (!this.opened) return;

    this.opened = false;
    className(this.controlElement, 'focus', false);
    visible(this.dropdownElement, false);

    this.onClose();
  }

  public async load(): Promise<void> {
    if (!this.settings.dataSrc) return this.onLoad(this.settings.data || []);

    return fetch(this.settings.dataSrc)
      .then(response => response.json())
      .then(this.onLoad);
  }

  public destroy(): void {
    document.removeEventListener('mousedown', this.onFocus, true);
    document.removeEventListener('focus', this.onFocus, true);

    if (this.wrapperElement) this.wrapperElement.remove();

    visible(this.rootElement, true);

    this.rootElement.treeSelect = null;
    this.rootElement.removeEventListener('change', this.onChange);
  }

  private initMount(): void {
    // create the wrapper element
    this.wrapperElement = create('div', 'wrapper', this.settings.html);
    this.wrapperElement.addEventListener('keydown', this.onKeyDown);
    this.rootElement.after(this.wrapperElement);

    // create the controlled element
    this.controlElement = create('div', 'control', this.settings.html);
    this.controlElement.tabIndex = 0;
    this.controlElement.innerHTML = `${this.selected.length} ${this.settings.selectedText}`;
    this.controlElement.addEventListener('focus', this.onFocus);
    this.wrapperElement.appendChild(this.controlElement);

    // create the dropdown element
    this.dropdownElement = create('div', 'dropdown', this.settings.html);
    visible(this.dropdownElement, false);
    this.wrapperElement.appendChild(this.dropdownElement);

    // create the heading element
    const headingContainer = create('div', 'heading', this.settings.html);
    const headingElement = create('span', 'headingSpan', this.settings.html);
    if (this.settings.headingText) headingElement.innerHTML = this.settings.headingText;
    headingContainer.appendChild(headingElement);

    // create the clear element
    const clearElement = create('span', 'clear', this.settings.html);
    clearElement.addEventListener('click', this.onClear);
    headingContainer.appendChild(clearElement);

    this.dropdownElement.appendChild(headingContainer);

    // create the search element
    const searchElement = create('input', 'search', this.settings.html);
    searchElement.type = 'search';
    if (this.settings.searchText) searchElement.placeholder = this.settings.searchText;
    searchElement.addEventListener('keyup', debounce(this.onSearch, 100));
    searchElement.addEventListener('search', debounce(this.onSearch, 100));
    this.dropdownElement.appendChild(searchElement);

    // create the loading element
    this.loadingElement = create('div', 'loading', this.settings.html);
    this.dropdownElement.appendChild(this.loadingElement);

    // add event listeners
    document.addEventListener('mousedown', this.onFocus, true);
    document.addEventListener('focus', this.onFocus, true);

    // hide the initial input element
    visible(this.rootElement, false);
  }

  private mountItems(): void {
    // create the list element
    const listElement = create('div', 'list', this.settings.html);

    // create the items
    this.items = new Map<string, TreeItem>();
    createItems(this.items, this.data, this.mountItem, listElement);

    // set the depth of the tree
    this.depth = Math.max(...Array.from(this.items.values()).map(item => item.depth));

    // populate the items
    populateItems(this.items, item => this.selected.includes(item.id) && item.depth === this.depth);

    this.render();

    // append the list element to the dropdown element
    visible(this.loadingElement, false);
    if (this.dropdownElement) this.dropdownElement.appendChild(listElement);

    this.mounted = true;
  }

  private mountItem(item: TreeItem, element: HTMLElement) {
    item.collapsed = item.depth >= this.settings.collapseDepth;

    // create root item element
    item.itemElement = create('div', 'item', this.settings.html);

    // create label with collapse element, checkbox and name
    const labelElement = create('div', 'label', this.settings.html);

    // create collapse element
    if (item.children) {
      item.collapseElement = create('div', 'collapse', this.settings.html);
      labelElement.appendChild(item.collapseElement);
    }

    // create checkbox element
    if (item.depth >= this.settings.checkboxDepth) {
      item.checkboxElement = create('input', 'checkbox', this.settings.html);
      item.checkboxElement.type = 'checkbox';
      item.checkboxElement.addEventListener('click', event => this.onItemSelect(event, item));
      labelElement.appendChild(item.checkboxElement);
    }

    const labelSpan = create('span', 'labelSpan', this.settings.html);
    labelSpan.innerHTML = item.name;
    labelElement.appendChild(labelSpan);
    labelElement.addEventListener('click', event =>
      item.children ? this.onItemCollapse(event, item) : this.onItemSelect(event, item)
    );

    // append label and children element to root item element
    item.itemElement.appendChild(labelElement);
    if (item.children) {
      item.childrenElement = create('div', 'children', this.settings.html);
      item.itemElement.appendChild(item.childrenElement);
    }

    // append item element to the parent element
    element.appendChild(item.itemElement);
  }

  private render(): void {
    this.items.forEach(this.renderItem);

    if (this.controlElement)
      this.controlElement.innerHTML = `${this.selected.length} ${this.settings.selectedText}`;
  }

  private renderItem(item: TreeItem): void {
    visible(item.childrenElement, !item.collapsed);
    visible(item.itemElement, !item.hidden);

    className(item.collapseElement, 'collapsed', item.collapsed);

    if (!item.checkboxElement) return;

    item.checkboxElement.checked = item.checked;
    item.checkboxElement.indeterminate = item.indeterminate;
  }

  private onLoad(data: Data[]): void {
    this.data = data;
    this.loaded = true;
    this.loading = false;

    if (!this.mounted) this.mountItems();

    if (this.settings.onLoad) this.settings.onLoad(data);
  }

  private onItemSelect(event: MouseEvent, item: TreeItem): void {
    event.stopPropagation();

    if (event.shiftKey && this.lastSelectedItem) {
      // get all items at same depth
      const itemsAtDepth = Array.from(this.items.values()).filter(i => i.depth === item.depth);

      // find indices of current and last selected items
      const currentIndex = itemsAtDepth.indexOf(item);
      const lastIndex = itemsAtDepth.indexOf(this.lastSelectedItem);

      // get range of items between current and last selected
      const start = Math.min(currentIndex, lastIndex + 1);
      const end = Math.max(currentIndex, lastIndex - 1);
      const itemsToUpdate = itemsAtDepth.slice(start, end + 1);

      // update all items in range
      itemsToUpdate.forEach(item => selectItem(this.items, item));
    } else {
      selectItem(this.items, item);

      this.lastSelectedItem = item;
    }

    this.selected = Array.from(this.items.values())
      .filter(item => item.checked && item.depth === this.depth)
      .map(item => item.id);

    setInputValues(this.rootElement, this.selected, this.settings.delimiter);

    this.render();

    if (this.settings.onSelect) this.settings.onSelect(this.selected);
  }

  private onItemCollapse(_event: Event, item: TreeItem): void {
    item.collapsed = !item.collapsed;

    this.renderItem(item);
  }

  private onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    if (search === this.search) return;

    this.search = search;

    if (this.search.length === 0) {
      updateItems(this.items, { hidden: false, collapsed: true });
    } else {
      updateItems(this.items, { hidden: true, collapsed: true });
      updateItems(this.items, item => {
        const match = item.fullName.toLowerCase().includes(this.search.toLowerCase());
        if (!match) return;

        item.hidden = false;

        updateItemDescendants(this.items, item, { hidden: false });
        updateItemAscendants(this.items, item, { hidden: false, collapsed: false });
      });
    }

    this.render();

    if (this.settings.onSearch) this.settings.onSearch(search);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.close();
  }

  private onClear(): void {
    this.selected = [];

    updateItems(this.items, { checked: false, indeterminate: false });
    setInputValues(this.rootElement, this.selected, this.settings.delimiter);

    this.render();

    if (this.settings.onClear) this.settings.onClear();
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
    this.selected = getInputValues(this.rootElement, this.settings.delimiter);
    if (!this.mounted) return;

    populateItems(this.items, item => this.selected.includes(item.id) && item.depth === this.depth);

    this.render();
  }
}

export { TreeItem, TreeSettings, Data };
