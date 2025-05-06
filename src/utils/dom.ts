export function hide(element: HTMLElement): void {
  element.style.display = 'none';
}

export function show(element: HTMLElement): void {
  element.style.display = '';
}

export function createWrapper(className?: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.classList.add('tree-select-wrapper');
  if (className) wrapper.classList.add(className);

  return wrapper;
}

export function createSearch(className?: string): HTMLInputElement {
  const input = document.createElement('input');
  input.classList.add('tree-select-search');
  if (className) input.classList.add(className);

  return input;
}

export function createDropdown(className?: string): HTMLElement {
  const dropdown = document.createElement('div');
  dropdown.classList.add('tree-select-dropdown');
  if (className) dropdown.classList.add(className);

  return dropdown;
}

export function createList(className?: string): HTMLElement {
  const list = document.createElement('div');
  list.classList.add('tree-select-list');
  if (className) list.classList.add(className);

  return list;
}

export function createItem(className?: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('tree-select-item');
  if (className) item.classList.add(className);

  return item;
}

export function createItemChildren(className?: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('tree-select-children');
  if (className) item.classList.add(className);

  return item;
}

export function createCheckbox(className?: string): HTMLInputElement {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('tree-select-checkbox');
  if (className) checkbox.classList.add(className);

  return checkbox;
}

export function createCollapse(className?: string): HTMLElement {
  const collapse = document.createElement('div');
  collapse.classList.add('tree-select-collapse');
  if (className) collapse.classList.add(className);
  collapse.innerHTML = '>';

  return collapse;
}
