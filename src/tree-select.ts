import {
  createItems,
  itemAscendants,
  itemValues,
  itemsDepth,
  searchItems,
  selectItem,
  selectItemRange,
  selectItemsByValues,
  updateItems,
} from "./utils/core";
import { className, create, debounce, visible } from "./utils/dom";
import { getInputElement, getInputValues, setInputValues } from "./utils/input";

import type { Data, TreeItem, TreeSettings } from "./types";

export class TreeSelect {
  public settings: TreeSettings = {
    mode: "vertical",
    open: false,
    clearable: true,
    searchable: true,
    collapsible: true,
    results: false,
    focus: "focus",
    disabled: "disabled",
    delimiter: ",",
    depthCollapsible: 0,
    depthCollapsed: 0,
    depthCheckboxes: 0,
    depthValues: "last",
    text: {
      selected: "selected",
      loading: "Loading...",
      search: "Search...",
    },
    html: {},
  };

  // UI
  public opened = false;
  public loaded = false;
  public loading = false;
  public mounted = false;
  public disabled = false;
  public search = "";

  // Data
  public data: Data[] = [];
  public values: string[] = [];
  public items: Map<string, TreeItem> = new Map();
  public lastItem: TreeItem | null = null;
  public activeItem: TreeItem | null = null;
  public activeItems: TreeItem[] = [];
  public depth = 0;
  public depthValues = 0;

  // DOM
  private rootElement: HTMLInputElement | HTMLSelectElement;
  private controlElement: HTMLElement | null = null;
  private wrapperElement: HTMLElement | null = null;
  private dropdownElement: HTMLElement | null = null;
  private loadingElement: HTMLElement | null = null;
  private listContainerElement: HTMLElement | null = null;
  private listsElements: HTMLElement[] = [];

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
    this.rootElement.addEventListener("change", this.onChange);

    // initialize the selected values
    this.values = getInputValues(this.rootElement, this.settings.delimiter);

    // mount initial HTML to the DOM, without fetching data or rendering tree
    this.initMount();

    if (this.rootElement.disabled) this.onDisable(true);
    if (this.settings.open) this.open();
  }

  public open(): void {
    if (this.opened) return;
    if (!this.loaded && !this.loading) debounce(() => this.load(), 0)();

    this.opened = true;
    className(this.wrapperElement, this.settings.focus, true);
    visible(this.dropdownElement, true);

    this.onOpen();
  }

  public close(): void {
    if (!this.opened) return;

    this.opened = false;
    className(this.wrapperElement, this.settings.focus, false);
    visible(this.dropdownElement, false);

    this.onClose();
  }

  public async load(): Promise<void> {
    if (!this.settings.dataSrc) return this.onLoad(this.settings.data || []);

    return fetch(this.settings.dataSrc)
      .then((response) => response.json())
      .then(this.onLoad);
  }

  public destroy(): void {
    this.rootElement.classList.remove("treeselected");
    document.removeEventListener("mousedown", this.onFocus, true);
    document.removeEventListener("focus", this.onFocus, true);

    if (this.wrapperElement) this.wrapperElement.remove();

    visible(this.rootElement, true);

    this.rootElement.treeSelect = null;
    this.rootElement.removeEventListener("change", this.onChange);
  }

  public disable(): void {
    this.onDisable(true);
  }

  public enable(): void {
    this.onDisable(false);
  }

  private initMount(): void {
    // create the wrapper element
    this.wrapperElement = create(
      "div",
      "wrapper",
      this.settings.html,
      this.rootElement.className
    );
    this.wrapperElement.addEventListener("focus", this.onFocus);
    this.wrapperElement.addEventListener("keydown", this.onKeyDown);
    this.rootElement.after(this.wrapperElement);

    // create the controlled element
    this.controlElement = create("div", "control", this.settings.html);
    this.controlElement.tabIndex = 0;
    this.controlElement.innerHTML = `${this.values.length} ${this.settings.text.selected}`;
    this.wrapperElement.appendChild(this.controlElement);

    if (this.settings.clearable) {
      const clearElement = create("span", "clear", this.settings.html);
      clearElement.innerHTML = "X";
      clearElement.addEventListener("click", this.onClear);
      this.wrapperElement.appendChild(clearElement);
    }

    // create the dropdown element
    this.dropdownElement = create("div", "dropdown", this.settings.html);
    visible(this.dropdownElement, false);
    this.wrapperElement.appendChild(this.dropdownElement);

    // create the search element
    if (this.settings.searchable) {
      const searchElement = create("input", "search", this.settings.html);
      searchElement.type = "search";
      if (this.settings.text.search)
        searchElement.placeholder = this.settings.text.search;
      searchElement.addEventListener("keyup", debounce(this.onSearch, 100));
      searchElement.addEventListener("search", debounce(this.onSearch, 100));
      this.dropdownElement.appendChild(searchElement);
    }

    // create the loading element
    this.loadingElement = create("div", "loading", this.settings.html);
    if (this.settings.text.loading)
      this.loadingElement.innerHTML = this.settings.text.loading;
    this.dropdownElement.appendChild(this.loadingElement);

    // add event listeners
    document.addEventListener("mousedown", this.onFocus, true);
    document.addEventListener("focus", this.onFocus, true);

    this.rootElement.classList.add("treeselected");

    // hide the initial input element
    visible(this.rootElement, false);
  }

  private mountItems(): void {
    // create the list container element
    this.listContainerElement = create(
      "div",
      "listContainer",
      this.settings.html
    );

    // create the lists elements
    const length = this.settings.results ? 2 : 1;

    this.listsElements = Array.from(
      {
        length:
          this.settings.mode === "horizontal" ? this.depth + length : length,
      },
      () => {
        const listElement = create("div", "list", this.settings.html);
        this.listContainerElement?.appendChild(listElement);
        return listElement;
      }
    );

    // mount the items
    for (const item of this.items.values()) {
      this.mountItem(item);
    }

    // append the items to the lists elements
    for (const item of this.items.values()) {
      if (!item.itemElement || !item.resultElement) continue;

      if (this.settings.mode === "horizontal") {
        this.listsElements[item.depth].appendChild(item.itemElement);
      } else {
        const parent = item.parent ? this.items.get(item.parent) : null;
        const parentElement = parent?.childrenElement || this.listsElements[0];

        parentElement.appendChild(item.itemElement);
      }

      // append the result element to the last list element
      if (this.settings.results && item.depth >= this.depthValues) {
        this.listsElements[this.listsElements.length - 1].appendChild(
          item.resultElement
        );
      }
    }

    this.render();

    // append the list element to the dropdown element
    visible(this.loadingElement, false);
    this.dropdownElement?.appendChild(this.listContainerElement);

    this.mounted = true;
  }

  private mountItem(item: TreeItem): void {
    const isClickable =
      item.children &&
      item.depth >= this.settings.depthCollapsible &&
      this.settings.collapsible;
    const isCheckable = item.depth >= this.settings.depthCheckboxes;

    item.collapsed = item.depth >= this.settings.depthCollapsed;

    // create root item element
    item.itemElement = create("div", "item", this.settings.html);

    // create label with collapse element, checkbox and name
    const labelElement = create("div", "label", this.settings.html);

    // create collapse element
    if (isClickable && this.settings.mode === "vertical") {
      item.collapseElement = create("div", "collapse", this.settings.html);
      labelElement.appendChild(item.collapseElement);
    }

    // create checkbox element
    if (isCheckable) {
      item.checkboxElement = create("input", "checkbox", this.settings.html);
      item.checkboxElement.type = "checkbox";
      item.checkboxElement.addEventListener("click", (event) =>
        this.onItemSelect(event, item)
      );
      labelElement.appendChild(item.checkboxElement);
    }

    const labelSpan = create("span", "labelSpan", this.settings.html);
    labelSpan.innerHTML = item.name;
    labelElement.appendChild(labelSpan);
    if (isClickable || isCheckable) {
      labelElement.addEventListener("click", (event) =>
        isClickable
          ? this.onItemClick(event, item)
          : this.onItemSelect(event, item)
      );
    }

    // append label and children element to root item element
    item.itemElement.appendChild(labelElement);
    if (item.children) {
      item.childrenElement = create("div", "children", this.settings.html);
      item.itemElement.appendChild(item.childrenElement);
    }

    item.resultElement = create("div", "result", this.settings.html);
    item.resultElement.innerHTML = item.fullName;
    item.resultElement.addEventListener("click", (event) =>
      this.onItemSelect(event, item)
    );
  }

  private render(): void {
    for (const item of this.items.values()) {
      this.renderItem(item);
    }

    if (this.controlElement)
      this.controlElement.innerHTML = `${this.values.length} ${this.settings.text.selected}`;
  }

  private renderItem(item: TreeItem): void {
    visible(
      item.childrenElement,
      !item.collapsed ||
        item.depth < this.settings.depthCollapsible ||
        !this.settings.collapsible
    );
    visible(
      item.itemElement,
      !item.hidden &&
        (this.settings.mode !== "horizontal" ||
          item.depth === 0 ||
          this.activeItems.some((a) => a._id === item.parent))
    );

    className(item.collapseElement, "collapsed", item.collapsed);
    className(item.itemElement, "active", this.activeItems.includes(item));

    visible(item.resultElement, !item.hidden && item.checked);

    if (!item.checkboxElement) return;

    item.checkboxElement.checked = item.checked;
    item.checkboxElement.indeterminate = item.indeterminate;
  }

  private onLoad(data: Data[]): void {
    this.data = data;
    this.loaded = true;
    this.loading = false;

    this.items = new Map<string, TreeItem>();
    createItems(this.items, this.data);
    this.depth = itemsDepth(this.items);

    this.depthValues =
      this.settings.depthValues === "last"
        ? this.depth
        : this.settings.depthValues;

    selectItemsByValues(this.items, this.values, this.depthValues);

    if (!this.mounted) this.mountItems();
    if (this.settings.onLoad) this.settings.onLoad(data);
  }

  private onItemSelect(event: MouseEvent, item: TreeItem): void {
    event.stopPropagation();

    if (event.shiftKey && this.lastItem) {
      selectItemRange(this.items, this.lastItem, item);
    } else {
      selectItem(this.items, item);

      this.lastItem = item;
    }

    // update input values
    this.values = itemValues(this.items, this.depthValues);
    setInputValues(this.rootElement, this.values, this.settings.delimiter);

    this.render();

    if (this.settings.onSelect) this.settings.onSelect(this.values);
  }

  private onItemClick(_event: Event, item: TreeItem): void {
    item.collapsed = !item.collapsed;

    if (this.settings.mode === "horizontal") {
      this.activeItem = item;
      this.activeItems = this.activeItem
        ? [...itemAscendants(this.items, this.activeItem), this.activeItem]
        : [];
    }

    this.render();
  }

  private onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    if (search === this.search) return;

    this.search = search;
    searchItems(this.items, search);

    this.render();

    if (this.settings.onSearch) this.settings.onSearch(search);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") this.close();
  }

  private onDisable(disabled: boolean): void {
    this.disabled = disabled;
    this.rootElement.disabled = disabled;
    className(this.wrapperElement, "disabled", disabled);
    className(this.controlElement, this.settings.disabled, disabled);
  }

  private onClear(): void {
    if (this.disabled) return;

    updateItems(this.items, { checked: false, indeterminate: false });

    // update input values
    this.values = [];
    setInputValues(this.rootElement, this.values, this.settings.delimiter);

    this.render();

    if (this.settings.onClear) this.settings.onClear();
  }

  private onOpen(): void {
    if (this.disabled) return;

    if (this.settings.onOpen) this.settings.onOpen();
  }

  private onClose(): void {
    if (this.settings.onClose) this.settings.onClose();
  }

  private onFocus(event: Event): void {
    if (this.disabled) return;

    if (this.wrapperElement?.contains(event.target as HTMLElement)) {
      this.open();
    } else {
      this.close();
    }
  }

  private onChange(_event: Event): void {
    this.values = getInputValues(this.rootElement, this.settings.delimiter);
    if (this.mounted)
      selectItemsByValues(this.items, this.values, this.depthValues);

    this.render();
  }
}

export type { TreeItem, TreeSettings, Data };
