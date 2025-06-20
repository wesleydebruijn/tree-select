import type { TreeHTMLElement } from "../types";

const classNames: Record<TreeHTMLElement, string> = {
  wrapper: "tree-select-wrapper",
  control: "tree-select-control",
  search: "tree-select-search",
  dropdown: "tree-select-dropdown",
  loading: "tree-select-loading",
  listContainer: "tree-select-list-container",
  list: "tree-select-list",
  item: "tree-select-item",
  checkbox: "tree-select-checkbox",
  collapse: "tree-select-collapse",
  clear: "tree-select-clear",
  label: "tree-select-label",
  labelSpan: "tree-select-label-span",
  children: "tree-select-children",
  result: "tree-select-result",
};

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function className(
  element: HTMLElement | null,
  className: string,
  add: boolean
): void {
  if (!element) return;

  if (add) {
    element.classList.add(...className.split(" "));
  } else {
    element.classList.remove(...className.split(" "));
  }
}

export function visible(element: HTMLElement | null, visible: boolean): void {
  if (!element) return;

  element.style.display = visible ? "" : "none";
}

export function create<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  key: TreeHTMLElement,
  settings: {
    [key in TreeHTMLElement]?: { className?: string; data?: object };
  },
  baseClassName?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  const { className, data } = settings[key] || {};

  if (baseClassName) element.classList.add(...baseClassName.split(" "));
  element.classList.add(...classNames[key].split(" "));
  if (className) element.classList.add(...className.split(" "));
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      element.dataset[key] = String(value);
    }
  }

  return element;
}
