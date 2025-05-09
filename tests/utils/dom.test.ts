import { className, create, debounce, visible } from "src/utils/dom";

describe("dom", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("debounce", () => {
    it("should debounce function calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call the function multiple times
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Function should be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments to debounced function", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("test", 123);
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith("test", 123);
    });

    it("should cancel previous timeout on new calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50); // Half the wait time

      debouncedFn();
      jest.advanceTimersByTime(50); // Another half

      // Function should not be called yet
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50); // Complete the second call
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("className", () => {
    it("should add class to element", () => {
      const element = document.createElement("div");
      className(element, "test-class", true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("should remove class from element", () => {
      const element = document.createElement("div");
      element.classList.add("test-class");
      className(element, "test-class", false);
      expect(element.classList.contains("test-class")).toBe(false);
    });

    it("should handle null element gracefully", () => {
      expect(() => className(null, "test-class", true)).not.toThrow();
    });
  });

  describe("visible", () => {
    it("should show element by removing display:none", () => {
      const element = document.createElement("div");
      element.style.display = "none";
      visible(element, true);
      expect(element.style.display).toBe("");
    });

    it("should hide element with display:none", () => {
      const element = document.createElement("div");
      visible(element, false);
      expect(element.style.display).toBe("none");
    });

    it("should handle null element gracefully", () => {
      expect(() => visible(null, true)).not.toThrow();
    });
  });

  describe("create", () => {
    it("should create element with default class", () => {
      const element = create("div", "item", {});
      expect(element.tagName).toBe("DIV");
      expect(element.classList.contains("tree-select-item")).toBe(true);
    });

    it("should create element with custom class", () => {
      const element = create("div", "item", {
        item: { className: "custom-class" },
      });
      expect(element.classList.contains("tree-select-item")).toBe(true);
      expect(element.classList.contains("custom-class")).toBe(true);
    });

    it("should create element with data attributes", () => {
      const element = create("div", "item", {
        item: { data: { testKey: "testValue", numKey: 123 } },
      });
      expect(element.dataset.testKey).toBe("testValue");
      expect(element.dataset.numKey).toBe("123");
    });

    it("should handle missing settings for key", () => {
      const element = create("div", "item", {
        // No settings for 'item'
      });
      expect(element.classList.contains("tree-select-item")).toBe(true);
      expect(Object.keys(element.dataset)).toHaveLength(0);
    });

    it("should create different HTML elements", () => {
      const div = create("div", "item", {});
      const span = create("span", "label", {});
      const input = create("input", "search", {});

      expect(div.tagName).toBe("DIV");
      expect(span.tagName).toBe("SPAN");
      expect(input.tagName).toBe("INPUT");
    });
  });
});
