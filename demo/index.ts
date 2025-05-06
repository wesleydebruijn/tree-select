import { TreeSelect, TreeRecord } from '../src/index';

// Sample data for different tree examples
const data: TreeRecord[] = [
  {
    id: '1',
    name: 'Apple',
    children: [
      {
        id: '2',
        name: 'iPhone 16',
        children: [
          { id: '3', name: 'Black' },
          { id: '4', name: 'Blue' },
        ],
      },
      {
        id: '5',
        name: 'iPhone 16 Pro',
        children: [
          { id: '6', name: 'Black' },
          { id: '7', name: 'Silver' },
        ],
      },
    ],
  },
  {
    id: '8',
    name: 'Samsung',
    children: [
      {
        id: '9',
        name: 'Galaxy S22',
        children: [
          { id: '10', name: 'Black' },
          { id: '11', name: 'Silver' },
        ],
      },
    ],
  },
];

new TreeSelect('#basic-tree', { data });
new TreeSelect('#checkbox-tree', { data });
new TreeSelect('#custom-tree', { data });
