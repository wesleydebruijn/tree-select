import type { Data, TreeItem } from "src/types";
import {
  createItems,
  itemAscendants,
  itemValues,
  itemsDepth,
  populateItems,
  propagateItem,
  searchItems,
  selectItem,
  selectItemRange,
  selectItemsByValues,
  updateItemAscendants,
  updateItemDescendants,
  updateItems,
} from "src/utils/core";

describe("core", () => {
  let items: Map<string, TreeItem>;

  beforeEach(() => {
    items = new Map();
  });

  describe("createItems", () => {
    it("should create items from data structure", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      expect(items.size).toBe(3);
      expect(items.get("0-1")?.name).toBe("Parent");
      expect(items.get("1-2")?.name).toBe("Child 1");
      expect(items.get("1-3")?.name).toBe("Child 2");
    });
  });

  describe("itemsDepth", () => {
    it("should return maximum depth of items", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Level 1",
          children: [
            {
              id: "2",
              name: "Level 2",
              children: [{ id: "3", name: "Level 3" }],
            },
          ],
        },
      ];

      createItems(items, data);

      expect(itemsDepth(items)).toBe(2);
    });
  });

  describe("itemValues", () => {
    it("should return values of checked items at or above minDepth", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      const parent = items.get("0-1");
      const child1 = items.get("1-2");
      if (parent && child1) {
        parent.checked = true;
        child1.checked = true;
      }

      expect(itemValues(items, 0).sort()).toEqual(["1", "2"].sort());
      expect(itemValues(items, 1)).toEqual(["2"]);
    });
  });

  describe("propagateItem", () => {
    it("should update parent state based on children", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      const parent = items.get("0-1");
      const child1 = items.get("1-2");
      const child2 = items.get("1-3");

      if (parent && child1 && child2) {
        child1.checked = true;
        child2.checked = true;
        propagateItem(items, parent);
        expect(parent.checked).toBe(true);
        expect(parent.indeterminate).toBe(false);

        child2.checked = false;
        propagateItem(items, parent);
        expect(parent.checked).toBe(false);
        expect(parent.indeterminate).toBe(true);
      }
    });
  });

  describe("searchItems", () => {
    it("should show matching items and their parents", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      searchItems(items, "Child 1");

      const parent = items.get("0-1");
      const child1 = items.get("1-2");
      const child2 = items.get("1-3");

      expect(parent?.hidden).toBe(false);
      expect(parent?.collapsed).toBe(false);
      expect(child1?.hidden).toBe(false);
      expect(child2?.hidden).toBe(true);
    });
  });

  describe("selectItem", () => {
    it("should toggle item and update related items", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      const parent = items.get("0-1");
      if (parent) {
        selectItem(items, parent);
        expect(parent.checked).toBe(true);
        expect(items.get("1-2")?.checked).toBe(true);
        expect(items.get("1-3")?.checked).toBe(true);

        selectItem(items, parent);
        expect(parent.checked).toBe(false);
        expect(items.get("1-2")?.checked).toBe(false);
        expect(items.get("1-3")?.checked).toBe(false);
      }
    });
  });

  describe("populateItems", () => {
    it("should set checked state based on isChecked function", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      populateItems(items, (item) => item.id === "2");

      const parent = items.get("0-1");
      const child1 = items.get("1-2");
      const child2 = items.get("1-3");

      expect(child1?.checked).toBe(true);
      expect(child2?.checked).toBe(false);
      expect(parent?.indeterminate).toBe(true);
    });
  });

  describe("selectItemRange", () => {
    it("should toggle items between two items at the same depth", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
            { id: "4", name: "Child 3" },
            { id: "5", name: "Child 4" },
          ],
        },
      ];

      createItems(items, data);

      const child1 = items.get("1-2");
      const child3 = items.get("1-4");

      if (child1 && child3) {
        selectItemRange(items, child1, child3);
        expect(items.get("1-2")?.checked).toBe(false);
        expect(items.get("1-3")?.checked).toBe(true);
        expect(items.get("1-4")?.checked).toBe(true);
        expect(items.get("1-5")?.checked).toBe(false);

        selectItemRange(items, child1, child3);
        expect(items.get("1-2")?.checked).toBe(false);
        expect(items.get("1-3")?.checked).toBe(false);
        expect(items.get("1-4")?.checked).toBe(false);
        expect(items.get("1-5")?.checked).toBe(false);
      }
    });
  });

  describe("itemAscendants", () => {
    it("should return array of parent items in ascending order", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Level 1",
          children: [
            {
              id: "2",
              name: "Level 2",
              children: [{ id: "3", name: "Level 3" }],
            },
          ],
        },
      ];

      createItems(items, data);

      const level3 = items.get("2-3");
      const level2 = items.get("1-2");
      const level1 = items.get("0-1");

      if (level3) {
        const ascendants = itemAscendants(items, level3);
        expect(ascendants).toHaveLength(2);
        expect(ascendants[0]).toBe(level2);
        expect(ascendants[1]).toBe(level1);
      }
    });

    it("should return empty array for root item", () => {
      const data: Data[] = [{ id: "1", name: "Root" }];

      createItems(items, data);

      const root = items.get("0-1");
      if (root) {
        const ascendants = itemAscendants(items, root);
        expect(ascendants).toHaveLength(0);
      }
    });
  });

  describe("selectItemsByValues", () => {
    it("should select items based on provided values", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      selectItemsByValues(items, ["2"], 1);

      const parent = items.get("0-1");
      const child1 = items.get("1-2");
      const child2 = items.get("1-3");

      expect(child1?.checked).toBe(true);
      expect(child2?.checked).toBe(false);
      expect(parent?.indeterminate).toBe(true);
    });
  });

  describe("updateItemAscendants", () => {
    it("should update all parent items", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Level 1",
          children: [
            {
              id: "2",
              name: "Level 2",
              children: [{ id: "3", name: "Level 3" }],
            },
          ],
        },
      ];

      createItems(items, data);

      const level3 = items.get("2-3");
      if (level3) {
        updateItemAscendants(items, level3, { hidden: false });
        expect(items.get("0-1")?.hidden).toBe(false);
        expect(items.get("1-2")?.hidden).toBe(false);
      }
    });
  });

  describe("updateItemDescendants", () => {
    it("should update all child items", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      const parent = items.get("0-1");
      if (parent) {
        updateItemDescendants(items, parent, { hidden: true });
        expect(items.get("1-2")?.hidden).toBe(true);
        expect(items.get("1-3")?.hidden).toBe(true);
      }
    });
  });

  describe("updateItems", () => {
    it("should update all items with provided values", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      updateItems(items, { hidden: true });
      expect(items.get("0-1")?.hidden).toBe(true);
      expect(items.get("1-2")?.hidden).toBe(true);
      expect(items.get("1-3")?.hidden).toBe(true);
    });

    it("should update all items using a function", () => {
      const data: Data[] = [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ];

      createItems(items, data);

      updateItems(items, (item) => ({ hidden: item.depth === 1 }));
      expect(items.get("0-1")?.hidden).toBe(false);
      expect(items.get("1-2")?.hidden).toBe(true);
      expect(items.get("1-3")?.hidden).toBe(true);
    });
  });
});
