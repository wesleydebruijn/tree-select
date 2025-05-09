import { TreeSelect } from "src/tree-select";

describe("TreeSelect", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with default settings", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input);

    expect(treeSelect.settings).toEqual({
      open: false,
      clearable: true,
      searchable: true,
      collapsible: true,
      delimiter: ",",
      depthCollapsible: 0,
      depthCollapsed: 0,
      depthCheckboxes: 0,
      depthValues: "last",
      text: {
        selected: "selected",
        clear: "clear",
        loading: "Loading...",
        search: "Search...",
      },
      html: {},
    });

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should initialize with custom settings", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input, {
      open: true,
      clearable: false,
      searchable: false,
      collapsible: false,
      delimiter: "|",
      depthCollapsible: 2,
      depthCollapsed: 1,
      depthCheckboxes: 3,
      depthValues: 2,
      text: {
        heading: "Custom Heading",
        selected: "items selected",
        clear: "remove all",
        loading: "please wait...",
        search: "filter...",
      },
      html: {
        wrapper: { className: "custom-wrapper" },
        control: { className: "custom-control" },
      },
    });

    expect(treeSelect.settings).toEqual({
      open: true,
      clearable: false,
      searchable: false,
      collapsible: false,
      delimiter: "|",
      depthCollapsible: 2,
      depthCollapsed: 1,
      depthCheckboxes: 3,
      depthValues: 2,
      text: {
        heading: "Custom Heading",
        selected: "items selected",
        clear: "remove all",
        loading: "please wait...",
        search: "filter...",
      },
      html: {
        wrapper: { className: "custom-wrapper" },
        control: { className: "custom-control" },
      },
    });

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should load data from settings", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input, {
      data: [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ],
    });

    await treeSelect.load();
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should load data from URL", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input, {
      dataSrc: "/api/data",
    });

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Parent",
              children: [
                { id: "2", name: "Child 1" },
                { id: "3", name: "Child 2" },
              ],
            },
          ]),
      })
    );

    await treeSelect.load();
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(global.fetch).toHaveBeenCalledWith("/api/data");
  });

  it("should handle open and close", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input);

    treeSelect.open();
    expect(document.body.innerHTML).toMatchSnapshot();

    treeSelect.close();
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should handle search", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input, {
      data: [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ],
    });

    treeSelect.open();
    const searchInput = document.querySelector(
      ".tree-select-search"
    ) as HTMLInputElement;
    searchInput.value = "Child 1";
    searchInput.dispatchEvent(new Event("input"));

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should handle clear", () => {
    const input = document.createElement("input");
    input.value = "1,2,3";
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input, {
      data: [
        {
          id: "1",
          name: "Parent",
          children: [
            { id: "2", name: "Child 1" },
            { id: "3", name: "Child 2" },
          ],
        },
      ],
    });

    treeSelect.open();
    const clearButton = document.querySelector(
      ".tree-select-clear"
    ) as HTMLElement;
    clearButton.click();

    expect(input.value).toBe("");
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("should handle destroy", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const treeSelect = new TreeSelect(input);

    treeSelect.destroy();
    expect(document.body.innerHTML).toBe('<input style="">');
  });
});
