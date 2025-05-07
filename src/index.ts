import { defaults, classNames } from './constants';
import {
  createDiv,
  createInput,
  createLabel,
  createSpan,
  createCheckbox,
  visible,
} from './utils/dom';
import { debounce } from './utils/global';
import { getInputElement, getInputValues } from './utils/input';
import { stripId, update, updateChildren, updateAncestors } from './utils/items';

import type { TreeItem, TreeRecord, TreeSettings } from './types';

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
  public search: string = '';

  public data: TreeRecord[] = [];
  public selected: string[] = [];

  public items: Map<string, TreeItem> = new Map();
  public itemLevels: number = 0;

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
    this.onFocus = this.onFocus.bind(this);
    this.onSearch = this.onSearch.bind(this);

    // initialize the root input element
    this.inputElement = getInputElement(input);

    if (this.inputElement.treeSelect) {
      throw new Error('TreeSelect already initialized on this element');
    }

    this.inputElement.treeSelect = this;

    // initialize the selected values from the input element
    this.selected = getInputValues(this.inputElement, this.settings.delimiter);

    this.data = this.settings.data || [];

    this.mount();

    if (this.settings.open) this.open();
  }

  public mount(): void {
    // create the wrapper element
    this.wrapperElement = createDiv(classNames.wrapper, this.settings.wrapperClassName);
    this.inputElement.after(this.wrapperElement);

    // create the search element
    this.searchElement = createInput(
      classNames.search,
      this.settings.searchClassName || this.inputElement.className
    );
    this.searchElement.placeholder = this.settings.placeholder;
    this.searchElement.addEventListener('keyup', debounce(this.onSearch, 100));
    this.wrapperElement.appendChild(this.searchElement);

    // create the dropdown element
    this.dropdownElement = createDiv(classNames.dropdown, this.settings.dropdownClassName);
    visible(this.dropdownElement, false);
    this.wrapperElement.appendChild(this.dropdownElement);

    // add event listeners
    document.addEventListener('mousedown', this.onFocus, true);
    document.addEventListener('focus', this.onFocus, true);

    // hide the initial input element
    // visible(this.inputElement, false);
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
      .then((data: TreeRecord[]) => {
        this.data = data;
        this.onLoad();
      });
  }

  public destroy(): void {
    document.removeEventListener('mousedown', this.onFocus, true);
    document.removeEventListener('focus', this.onFocus, true);

    this.wrapperElement?.remove();
    visible(this.inputElement, true);

    this.inputElement.treeSelect = null;
  }

  private createList(): void {
    this.listElement?.remove();

    this.listElement = createDiv(classNames.list, this.settings.listClassName);
    this.createItems(this.data, 0, this.listElement);
    this.selectItems(this.selected);

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

      const itemElement = createDiv(classNames.item, this.settings.itemClassName);
      const labelElement = createLabel(classNames.itemLabel);
      itemElement.appendChild(labelElement);

      const checkboxElement = createCheckbox(
        classNames.itemCheckbox,
        this.settings.checkboxClassName
      );
      checkboxElement.addEventListener('click', event => this.onItemSelect(event, item));

      let collapseElement: HTMLElement | null = null;
      let childrenElement: HTMLElement | null = null;
      if (record.children) {
        collapseElement = createDiv(classNames.itemCollapse, this.settings.collapseClassName);
        collapseElement.addEventListener('click', event => this.onItemCollapse(event, item));
        labelElement.appendChild(collapseElement);

        childrenElement = createDiv(classNames.itemChildren);
        itemElement.appendChild(childrenElement);

        this.createItems(record.children, level + 1, childrenElement, item.id);
      }

      labelElement.appendChild(checkboxElement);
      labelElement.appendChild(createSpan(record.name));

      if (parentElement) parentElement.appendChild(itemElement);

      item.itemElement = itemElement;
      item.checkboxElement = checkboxElement;
      item.collapseElement = collapseElement;
      item.childrenElement = childrenElement;

      this.items.set(item.id, item);
    });
  }

  private selectItems(selected: string[]): void {
    let ancestors = new Set<string>();

    update(this.items, item => {
      const checked = item.level === this.itemLevels && selected.includes(stripId(item.id));

      if (checked && item.parent) ancestors.add(item.parent);

      return { checked, indeterminate: false };
    });

    ancestors.forEach(id => {
      const item = this.items.get(id)!;

      this.propagateItems(item);
      updateAncestors(this.items, item, item => this.propagateItems(item));
    });
  }

  private propagateItems(item: TreeItem): void {
    if (!item.children) return;

    const children = item.children.map(id => this.items.get(id)!);
    const allChecked = children.every(child => child.checked);
    const someChecked = children.some(child => child.checked || child.indeterminate);

    item.checked = allChecked;
    item.indeterminate = !allChecked && someChecked;
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

    updateChildren(this.items, item, { checked: item.checked, indeterminate: false });
    updateAncestors(this.items, item, item => this.propagateItems(item));

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
      update(this.items, { hidden: false, collapsed: true });
    } else {
      update(this.items, { hidden: true, collapsed: false });
      update(this.items, item => {
        const match = item.name.toLowerCase().includes(this.search.toLowerCase());
        if (!match) return;

        item.hidden = false;

        updateChildren(this.items, item, { hidden: false });
        updateAncestors(this.items, item, { hidden: false });
      });
    }

    this.updateDOM();

    if (this.settings.onSearch) this.settings.onSearch(search);
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
}

export { TreeItem, TreeRecord, TreeSettings };
