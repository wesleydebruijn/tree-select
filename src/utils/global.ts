export function debounce<T extends (...args: any[]) => void>(
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

export function className(element: HTMLElement | null, className: string, add: boolean): void {
  if (!element) return;

  if (add) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export function visible(element: HTMLElement | null, visible: boolean): void {
  if (!element) return;

  element.style.display = visible ? '' : 'none';
}

export function create<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  classNames?: (string | undefined)[],
  innerHTML?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  classNames?.forEach(className => className && element.classList.add(className));
  if (innerHTML) element.innerHTML = innerHTML;

  return element;
}
