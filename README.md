# Tree Select

A lightweight (~3kb gzipped), zero-dependency UI control that transforms `<select>` or `<input>` elements into interactive hierarchical trees with checkboxes.

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![build status][github-actions-image]][github-actions-url]
[![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/@wesleydebruijn/tree-select.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@wesleydebruijn/tree-select
[github-actions-image]: https://github.com/wesleydebruijn/tree-select/workflows/CI/badge.svg
[github-actions-url]: https://github.com/wesleydebruijn/tree-select/actions
[download-image]: https://img.shields.io/npm/dm/@wesleydebruijn/tree-select.svg?style=flat-square
[download-url]: https://npmjs.org/package/@wesleydebruijn/tree-select
[bundlephobia-url]: https://bundlephobia.com/package/@wesleydebruijn/tree-select
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@wesleydebruijn/tree-select

## Features

- Async data fetching
- Customizable depth for collapsing, checkboxes and values
- Parent/child selection propagation
- Supports both input and select HTML elements
- Built in functionalities like search, shift+select, clear
- Tailwind support by injectable classNames
- TypeScript support

## Installation

```bash
npm install @wesleydebruijn/tree-select
```

## Usage

### Basic Usage

```html
<input type="text" id="tree-select" value="1,2" />
<!-- or -->
<select id="tree-select" multiple>
  <option value="1" selected>1</option>
  <option value="2" selected>2</option>
  <option value="3">3</option>
</select>
```

```typescript
import { TreeSelect } from 'tree-select';

const settings = {
  data: [
    {
      id: '1',
      name: 'Parent 1',
      children: [
        { id: '1-1', name: 'Child 1-1' },
        { id: '1-2', name: 'Child 1-2' },
      ],
    },
    {
      id: '2',
      name: 'Parent 2',
      children: [
        { id: '2-1', name: 'Child 2-1' },
        { id: '2-2', name: 'Child 2-2' },
      ],
    },
  ],
  text: {
    search: 'Search items...',
    selected: 'items selected',
    loading: 'Loading...',
  },
};

const element = document.getElementByid('tree-select');
const treeSelect = new TreeSelect(element, settings);
// or
const treeSelect = new TreeSelect('#tree-select', settings);
```

### Advanced Configuration

```typescript
const treeSelect = new TreeSelect('#tree-select', {
  // UI state
  mode: 'vertical',
  open: false,
  collapsible: true,
  searchable: true,
  clearable: true,
  results: false,

  // Data configuration
  data: [...], // Tree data
  dataSrc: 'api/tree-data.json', // Or load from URL

  // Depth settings
  depthCollapsible: 0, // Depth at which items become collapsible
  depthCollapsed: 0,   // Depth at which items are collapsed by default
  depthCheckboxes: 0,  // Depth at which checkboxes appear
  depthValues: 'last', // Use 'last' or number to specify which depth values are used

  // Text customization
  text: {
    search: 'Search...',
    selected: 'selected',
    loading: 'Loading...'
  },

  // HTML customization
  focus: 'focus',
  disabled: 'disabled',
  html: {
    wrapper: { className: 'custom-wrapper', data: { value: "custom" } },
    control: { className: 'custom-control' },
    // ... customize other elements
  },

  // Event handlers
  onOpen: () => console.log('Opened'),
  onClose: () => console.log('Closed'),
  onSelect: (selected) => console.log('Selected:', selected),
  onSearch: (search) => console.log('Searching:', search),
  onLoad: (data) => console.log('Data loaded:', data),
  onClear: () => console.log('Cleared')
});
```

### Methods

```typescript
// Open the dropdown
treeSelect.open();

// Close the dropdown
treeSelect.close();

// Load data & HTML tree to the DOM
treeSelect.load();

// Disable the input & control
treeSelect.disable();

// Enable the input & control
treeSelect.enable();

// Destroy the instance and return to original input/select
treeSelect.destroy();
```

### Data Structure

```typescript
interface Data {
  id: string | number;
  name: string;
  children?: Data[];
}
```
## Settings
| Setting          | Type             | Default      | Description                                 |
| ---------------- | ---------------- | ------------ | ------------------------------------------- |
| mode             | 'vertical' \| 'horizontal'| 'vertical' | Display tree vertically or horizontally |
| open             | boolean          | false        | Whether dropdown should be open initially   |
| clearable        | boolean          | true         | Whether to show clear button                |
| searchable       | boolean          | true         | Whether to show search input                |
| collapsible      | boolean          | true         | Whether nodes can be collapsed              |
| results          | boolean          | false        | Whether to show selected items on side      |
| delimiter        | string           | ','          | Delimiter for input values                  |
| depthCollapsible | number           | 0            | Depth at which nodes become collapsible     |
| depthCollapsed   | number           | 0            | Depth at which nodes start collapsed        |
| depthCheckboxes  | number           | 0            | Depth at which checkboxes start appearing   |
| depthValues      | number \| 'last' | 'last'       | Depth at which values start being collected |
| data             | Data[]           | undefined    | Initial data array                         |
| dataSrc          | string           | undefined    | URL to fetch data from                     |
| focus            | string           | 'focus'      | Class name applied when dropdown is focused |
| text             | object           | {}           | Text customization options                  |
| text.heading     | string           | undefined    | Text shown in dropdown heading              |
| text.selected    | string           | 'selected'   | Text shown after selected count             |
| text.loading     | string           | 'Loading...' | Text shown while loading                    |
| text.search      | string           | 'Search...'  | Placeholder text for search input           |
| html             | object           | {}           | HTML elements customization                 |
| onLoad           | function         | undefined    | Callback when data is loaded                |
| onOpen           | function         | undefined    | Callback when dropdown opens                |
| onClose          | function         | undefined    | Callback when dropdown closes               |
| onClear          | function         | undefined    | Callback when selection is cleared          |
| onSearch         | function         | undefined    | Callback when search is performed           |
| onSelect         | function         | undefined    | Callback when items are selected/deselected |

## HTML Elements

| Element     | Class Name               | Description                                       |
| ----------- | ------------------------ | ------------------------------------------------- |
| wrapper     | tree-select-wrapper      | Container element wrapping the entire component   |
| control     | tree-select-control      | Main control element showing selected count       |
| dropdown    | tree-select-dropdown     | Dropdown container that appears when opened       |
| clear       | tree-select-clear        | Clear button to remove all selections             |
| search      | tree-select-search       | Search input field for filtering items            |
| loading     | tree-select-loading      | Loading indicator shown while data loads          |
| listContainer | tree-select-list-container | Container for all lists of the tree           |
| list        | tree-select-list         | Container for a list of the three                 |
| item        | tree-select-item         | Individual item in the tree                       |
| checkbox    | tree-select-checkbox     | Checkbox input for selecting items                |
| collapse    | tree-select-collapse     | Toggle button for expanding/collapsing nodes      |
| label       | tree-select-label        | Label container for item text and controls        |
| labelSpan   | tree-select-label-span   | Text element within item label                    |
| children    | tree-select-children     | Container for child items                         |
| result      | tree-select-result       | Individual item of selected item in the tree      |


## Development
To set up the development environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/@wesleydebruijn/tree-select.git
   cd tree-select
   ```

2. Start the development server:
   ```bash
   cd demo
   npm install
   npm run dev
   ```

This will start a Vite development server with hot module reloading. The demo page will be available at `http://localhost:5173/tree-select/`.
