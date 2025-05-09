# Tree Select

A lightweight (~4kb gzipped), zero-dependency UI control that transforms `<select>` or `<input>` elements into interactive hierarchical trees with checkboxes.

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
npm install tree-select
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
    clear: 'Clear',
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
  open: false,
  collapsible: true,
  searchable: true,
  clearable: true,

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
    heading: 'Select Items',
    search: 'Search...',
    selected: 'selected',
    clear: 'Clear',
    loading: 'Loading...'
  },

  // HTML customization
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
| open             | boolean          | false        | Whether dropdown should be open initially   |
| clearable        | boolean          | true         | Whether to show clear button               |
| searchable       | boolean          | true         | Whether to show search input               |
| collapsible      | boolean          | true         | Whether nodes can be collapsed             |
| delimiter        | string           | ','          | Delimiter for input values                  |
| depthCollapsible | number           | 0            | Depth at which nodes become collapsible     |
| depthCollapsed   | number           | 0            | Depth at which nodes start collapsed        |
| depthCheckboxes  | number           | 0            | Depth at which checkboxes start appearing   |
| depthValues      | number \| 'last' | 'last'       | Depth at which values start being collected |
| data             | Data[]           | undefined    | Initial data array                         |
| dataSrc          | string           | undefined    | URL to fetch data from                     |
| text             | object           | {}           | Text customization options                  |
| text.heading     | string           | undefined    | Text shown in dropdown heading              |
| text.selected    | string           | 'selected'   | Text shown after selected count             |
| text.clear       | string           | 'Clear'      | Text for clear button                       |
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
| heading     | tree-select-heading      | Heading section containing title and clear button |
| headingSpan | tree-select-heading-span | Text element within heading showing title         |
| clear       | tree-select-clear        | Clear button to remove all selections             |
| search      | tree-select-search       | Search input field for filtering items            |
| loading     | tree-select-loading      | Loading indicator shown while data loads          |
| list        | tree-select-list         | Container for the tree structure                  |
| item        | tree-select-item         | Individual item in the tree                       |
| checkbox    | tree-select-checkbox     | Checkbox input for selecting items                |
| collapse    | tree-select-collapse     | Toggle button for expanding/collapsing nodes      |
| label       | tree-select-label        | Label container for item text and controls        |
| labelSpan   | tree-select-label-span   | Text element within item label                    |
| children    | tree-select-children     | Container for child items                         |
