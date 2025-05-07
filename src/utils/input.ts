export function getInputElement(
  input: HTMLInputElement | HTMLSelectElement | string
): HTMLInputElement | HTMLSelectElement {
  if (typeof input === 'string') {
    const element = document.querySelector<HTMLInputElement | HTMLSelectElement>(input);

    if (!element) throw new Error(`Element ${input} not found`);

    return element;
  }

  return input;
}

export function getInputValues(
  input: HTMLInputElement | HTMLSelectElement,
  delimiter: string = ','
): string[] {
  return input instanceof HTMLInputElement
    ? input.value.split(delimiter)
    : Array.from(input.selectedOptions).map(option => option.value);
}
