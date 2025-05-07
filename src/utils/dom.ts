export function visible(element: HTMLElement | null, visible: boolean): void {
  if (!element) return;

  element.style.display = visible ? '' : 'none';
}

export function remove(element: HTMLElement | null): void {
  if (!element) return;

  element.remove();
}

export function createDiv(name: string, className?: string): HTMLElement {
  const div = document.createElement('div');
  div.classList.add(name);
  if (className) div.classList.add(className);

  return div;
}

export function createInput(name: string, className?: string): HTMLInputElement {
  const input = document.createElement('input');
  input.classList.add(name);
  if (className) input.classList.add(className);

  return input;
}

export function createCheckbox(name: string, className?: string): HTMLInputElement {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add(name);
  if (className) checkbox.classList.add(className);

  return checkbox;
}
