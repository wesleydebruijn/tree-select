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

export function setInputValues(
  input: HTMLInputElement | HTMLSelectElement,
  values: string[],
  delimiter: string = ','
): void {
  if (input instanceof HTMLInputElement) {
    input.value = values.join(delimiter);
  } else {
    Array.from(input.options).forEach(option => {
      option.selected = values.includes(option.value);
    });

    values
      .filter(value => !Array.from(input.options).some(option => option.value === value))
      .forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.text = value;
        option.selected = true;
        input.add(option);
      });
  }
}
