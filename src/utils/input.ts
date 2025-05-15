export function getInputElement(
  input: HTMLInputElement | HTMLSelectElement | string,
): HTMLInputElement | HTMLSelectElement {
  let element: HTMLInputElement | HTMLSelectElement | null;

  if (typeof input === "string") {
    element = document.querySelector<HTMLInputElement | HTMLSelectElement>(input);
  } else {
    element = input;
  }

  if (!element) throw new Error(`Element ${input} not found`);
  if (element.treeSelect) throw new Error("TreeSelect already initialized on element");

  return element;
}

export function getInputValues(
  input: HTMLInputElement | HTMLSelectElement,
  delimiter = ",",
): string[] {
  return input instanceof HTMLInputElement
    ? input.value.split(delimiter).filter(Boolean)
    : Array.from(input.selectedOptions).map((option) => option.value);
}

export function setInputValues(
  input: HTMLInputElement | HTMLSelectElement,
  values: string[],
  delimiter = ",",
): void {
  if (input instanceof HTMLInputElement) {
    input.value = values.join(delimiter);
  } else {
    const options = Array.from(input.options);
    const optionValues = new Set(options.map((opt) => opt.value));

    for (const option of options) {
      option.selected = values.includes(option.value);
    }

    for (const value of values) {
      if (!optionValues.has(value)) {
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        option.selected = true;
        input.add(option);
      }
    }
  }
}
