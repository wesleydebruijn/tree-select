import type { TreeSelect } from "src/tree-select";
import { getInputElement, getInputValues, setInputValues } from "src/utils/input";

describe("input", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("getInputElement", () => {
    it("should return the input element when passed an element", () => {
      const input = document.createElement("input");
      expect(getInputElement(input)).toBe(input);
    });

    it("should return the select element when passed an element", () => {
      const select = document.createElement("select");
      expect(getInputElement(select)).toBe(select);
    });

    it("should find and return an input element by selector", () => {
      const input = document.createElement("input");
      input.id = "test-input";
      document.body.appendChild(input);
      expect(getInputElement("#test-input")).toBe(input);
    });

    it("should find and return a select element by selector", () => {
      const select = document.createElement("select");
      select.id = "test-select";
      document.body.appendChild(select);
      expect(getInputElement("#test-select")).toBe(select);
    });

    it("should throw an error when element is not found", () => {
      expect(() => getInputElement("#non-existent")).toThrow("Element #non-existent not found");
    });

    it("should throw an error when element already has TreeSelect initialized", () => {
      const input = document.createElement("input");
      (input as { treeSelect: TreeSelect }).treeSelect = {} as TreeSelect;
      expect(() => getInputElement(input)).toThrow("TreeSelect already initialized on element");
    });
  });

  describe("getInputValues", () => {
    it("should get values from input element with default delimiter", () => {
      const input = document.createElement("input");
      input.value = "value1,value2,value3";
      expect(getInputValues(input)).toEqual(["value1", "value2", "value3"]);
    });

    it("should get values from input element with custom delimiter", () => {
      const input = document.createElement("input");
      input.value = "value1|value2|value3";
      expect(getInputValues(input, "|")).toEqual(["value1", "value2", "value3"]);
    });

    it("should get values from select element", () => {
      const select = document.createElement("select");
      select.multiple = true;

      const option1 = document.createElement("option");
      option1.value = "value1";
      option1.selected = true;

      const option2 = document.createElement("option");
      option2.value = "value2";
      option2.selected = true;

      const option3 = document.createElement("option");
      option3.value = "value3";

      select.appendChild(option1);
      select.appendChild(option2);
      select.appendChild(option3);

      expect(getInputValues(select)).toEqual(["value1", "value2"]);
    });
  });

  describe("setInputValues", () => {
    it("should set values on input element with default delimiter", () => {
      const input = document.createElement("input");
      setInputValues(input, ["value1", "value2", "value3"]);
      expect(input.value).toBe("value1,value2,value3");
    });

    it("should set values on input element with custom delimiter", () => {
      const input = document.createElement("input");
      setInputValues(input, ["value1", "value2", "value3"], "|");
      expect(input.value).toBe("value1|value2|value3");
    });

    it("should set values on select element", () => {
      const select = document.createElement("select");
      select.multiple = true;

      const option1 = document.createElement("option");
      option1.value = "value1";

      const option2 = document.createElement("option");
      option2.value = "value2";

      select.appendChild(option1);
      select.appendChild(option2);

      setInputValues(select, ["value1", "value3"]);

      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(false);
      expect(select.options.length).toBe(3);
      expect(select.options[2].value).toBe("value3");
      expect(select.options[2].selected).toBe(true);
    });

    it("should handle empty values array", () => {
      const input = document.createElement("input");
      setInputValues(input, []);
      expect(input.value).toBe("");

      const select = document.createElement("select");
      select.multiple = true;
      const option = document.createElement("option");
      option.value = "value1";
      option.selected = true;
      select.appendChild(option);

      setInputValues(select, []);
      expect(option.selected).toBe(false);
    });
  });
});
