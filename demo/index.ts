import { TreeSelect, TreeRecord } from '../src/index';

// Sample data for different tree examples
const data: TreeRecord[] = [
  {
    id: '1',
    name: 'Apple',
    children: [
      {
        id: '2',
        name: 'iPhone 15',
        children: [
          { id: '3', name: 'Midnight Black' },
          { id: '4', name: 'Pacific Blue' },
          { id: '5', name: 'Silver' },
          { id: '6', name: 'Gold' },
          { id: '7', name: 'Rose Gold' },
        ],
      },
      {
        id: '8',
        name: 'iPhone 15 Pro',
        children: [
          { id: '9', name: 'Space Black' },
          { id: '10', name: 'Natural Titanium' },
          { id: '11', name: 'White Titanium' },
          { id: '12', name: 'Blue Titanium' },
        ],
      },
      {
        id: '13',
        name: 'iPhone 15 Pro Max',
        children: [
          { id: '14', name: 'Space Black' },
          { id: '15', name: 'Natural Titanium' },
          { id: '16', name: 'White Titanium' },
          { id: '17', name: 'Blue Titanium' },
        ],
      },
      {
        id: '18',
        name: 'iPhone 14',
        children: [
          { id: '19', name: 'Midnight' },
          { id: '20', name: 'Starlight' },
          { id: '21', name: 'Purple' },
          { id: '22', name: 'Yellow' },
          { id: '23', name: 'Red' },
        ],
      },
      {
        id: '109',
        name: 'iPhone 14 Pro',
        children: [
          { id: '110', name: 'Space Black' },
          { id: '111', name: 'Silver' },
          { id: '112', name: 'Gold' },
          { id: '113', name: 'Deep Purple' },
        ],
      },
      {
        id: '114',
        name: 'iPhone 14 Pro Max',
        children: [
          { id: '115', name: 'Space Black' },
          { id: '116', name: 'Silver' },
          { id: '117', name: 'Gold' },
          { id: '118', name: 'Deep Purple' },
        ],
      },
      {
        id: '119',
        name: 'iPhone 13',
        children: [
          { id: '120', name: 'Midnight' },
          { id: '121', name: 'Starlight' },
          { id: '122', name: 'Blue' },
          { id: '123', name: 'Pink' },
          { id: '124', name: 'Green' },
        ],
      },
      {
        id: '125',
        name: 'iPhone 13 Pro',
        children: [
          { id: '126', name: 'Graphite' },
          { id: '127', name: 'Gold' },
          { id: '128', name: 'Silver' },
          { id: '129', name: 'Sierra Blue' },
          { id: '130', name: 'Alpine Green' },
        ],
      },
      {
        id: '131',
        name: 'iPhone 13 Pro Max',
        children: [
          { id: '132', name: 'Graphite' },
          { id: '133', name: 'Gold' },
          { id: '134', name: 'Silver' },
          { id: '135', name: 'Sierra Blue' },
          { id: '136', name: 'Alpine Green' },
        ],
      },
      {
        id: '77',
        name: 'MacBook Pro',
        children: [
          { id: '78', name: 'Space Gray' },
          { id: '79', name: 'Silver' },
        ],
      },
      {
        id: '80',
        name: 'iPad Pro',
        children: [
          { id: '81', name: 'Space Gray' },
          { id: '82', name: 'Silver' },
        ],
      },
    ],
  },
  {
    id: '24',
    name: 'Samsung',
    children: [
      {
        id: '25',
        name: 'Galaxy S24',
        children: [
          { id: '26', name: 'Phantom Black' },
          { id: '27', name: 'Cream' },
          { id: '28', name: 'Gray' },
          { id: '29', name: 'Violet' },
          { id: '30', name: 'Green' },
        ],
      },
      {
        id: '31',
        name: 'Galaxy S24 Ultra',
        children: [
          { id: '32', name: 'Titanium Black' },
          { id: '33', name: 'Titanium Gray' },
          { id: '34', name: 'Titanium Violet' },
          { id: '35', name: 'Titanium Yellow' },
        ],
      },
      {
        id: '137',
        name: 'Galaxy S23',
        children: [
          { id: '138', name: 'Phantom Black' },
          { id: '139', name: 'Cream' },
          { id: '140', name: 'Green' },
          { id: '141', name: 'Lavender' },
        ],
      },
      {
        id: '142',
        name: 'Galaxy S23+',
        children: [
          { id: '143', name: 'Phantom Black' },
          { id: '144', name: 'Cream' },
          { id: '145', name: 'Green' },
          { id: '146', name: 'Lavender' },
        ],
      },
      {
        id: '147',
        name: 'Galaxy S23 Ultra',
        children: [
          { id: '148', name: 'Phantom Black' },
          { id: '149', name: 'Cream' },
          { id: '150', name: 'Green' },
          { id: '151', name: 'Lavender' },
        ],
      },
      {
        id: '36',
        name: 'Galaxy Z Fold5',
        children: [
          { id: '37', name: 'Phantom Black' },
          { id: '38', name: 'Cream' },
          { id: '39', name: 'Icy Blue' },
        ],
      },
      {
        id: '40',
        name: 'Galaxy Z Flip5',
        children: [
          { id: '41', name: 'Mint' },
          { id: '42', name: 'Lavender' },
          { id: '43', name: 'Cream' },
          { id: '44', name: 'Graphite' },
        ],
      },
      {
        id: '152',
        name: 'Galaxy Z Fold4',
        children: [
          { id: '153', name: 'Phantom Black' },
          { id: '154', name: 'Beige' },
          { id: '155', name: 'Burgundy' },
        ],
      },
      {
        id: '156',
        name: 'Galaxy Z Flip4',
        children: [
          { id: '157', name: 'Bora Purple' },
          { id: '158', name: 'Graphite' },
          { id: '159', name: 'Pink Gold' },
          { id: '160', name: 'Blue' },
        ],
      },
      {
        id: '83',
        name: 'Galaxy Tab S9',
        children: [
          { id: '84', name: 'Graphite' },
          { id: '85', name: 'Beige' },
        ],
      },
    ],
  },
  {
    id: '45',
    name: 'Google',
    children: [
      {
        id: '46',
        name: 'Pixel 8',
        children: [
          { id: '47', name: 'Obsidian' },
          { id: '48', name: 'Hazel' },
          { id: '49', name: 'Rose' },
        ],
      },
      {
        id: '50',
        name: 'Pixel 8 Pro',
        children: [
          { id: '51', name: 'Obsidian' },
          { id: '52', name: 'Porcelain' },
          { id: '53', name: 'Bay Blue' },
        ],
      },
      {
        id: '54',
        name: 'Pixel 7',
        children: [
          { id: '55', name: 'Obsidian' },
          { id: '56', name: 'Snow' },
          { id: '57', name: 'Lemongrass' },
        ],
      },
      {
        id: '86',
        name: 'Pixel Tablet',
        children: [
          { id: '87', name: 'Porcelain' },
          { id: '88', name: 'Hazel' },
        ],
      },
    ],
  },
  {
    id: '58',
    name: 'OnePlus',
    children: [
      {
        id: '59',
        name: 'OnePlus 12',
        children: [
          { id: '60', name: 'Silky Black' },
          { id: '61', name: 'Flowy Emerald' },
          { id: '62', name: 'White' },
        ],
      },
      {
        id: '63',
        name: 'OnePlus 11',
        children: [
          { id: '64', name: 'Titan Black' },
          { id: '65', name: 'Eternal Green' },
          { id: '66', name: 'Marble Odyssey' },
        ],
      },
      {
        id: '89',
        name: 'OnePlus Nord',
        children: [
          { id: '90', name: 'Gray Shadow' },
          { id: '91', name: 'Jade Fog' },
        ],
      },
    ],
  },
  {
    id: '67',
    name: 'Xiaomi',
    children: [
      {
        id: '68',
        name: 'Redmi Note 13 Pro',
        children: [
          { id: '69', name: 'Midnight Black' },
          { id: '70', name: 'Ocean Teal' },
          { id: '71', name: 'Aurora Purple' },
          { id: '72', name: 'Forest Green' },
        ],
      },
      {
        id: '73',
        name: 'Xiaomi 13T Pro',
        children: [
          { id: '74', name: 'Black' },
          { id: '75', name: 'Alpine Blue' },
          { id: '76', name: 'Meadow Green' },
        ],
      },
      {
        id: '92',
        name: 'POCO F5',
        children: [
          { id: '93', name: 'Carbon Black' },
          { id: '94', name: 'Snowstorm White' },
        ],
      },
    ],
  },
  {
    id: '95',
    name: 'Nothing',
    children: [
      {
        id: '96',
        name: 'Phone (2)',
        children: [
          { id: '97', name: 'Dark Gray' },
          { id: '98', name: 'White' },
        ],
      },
      {
        id: '99',
        name: 'Phone (1)',
        children: [
          { id: '100', name: 'Black' },
          { id: '101', name: 'White' },
        ],
      },
    ],
  },
  {
    id: '102',
    name: 'Motorola',
    children: [
      {
        id: '103',
        name: 'Edge 40 Pro',
        children: [
          { id: '104', name: 'Interstellar Black' },
          { id: '105', name: 'Lunar Blue' },
        ],
      },
      {
        id: '106',
        name: 'Razr 40 Ultra',
        children: [
          { id: '107', name: 'Infinite Black' },
          { id: '108', name: 'Viva Magenta' },
        ],
      },
    ],
  },
  {
    id: '200',
    name: 'ASUS',
    children: [
      {
        id: '201',
        name: 'ROG Phone 8 Pro',
        children: [
          { id: '202', name: 'Phantom Black' },
          { id: '203', name: 'Storm White' },
        ],
      },
      {
        id: '204',
        name: 'Zenfone 10',
        children: [
          { id: '205', name: 'Midnight Black' },
          { id: '206', name: 'Aurora Green' },
          { id: '207', name: 'Starry Blue' },
        ],
      },
    ],
  },
  {
    id: '210',
    name: 'OPPO',
    children: [
      {
        id: '211',
        name: 'Find X7 Pro',
        children: [
          { id: '212', name: 'Ocean Blue' },
          { id: '213', name: 'Desert Moon' },
          { id: '214', name: 'Sepia Brown' },
        ],
      },
      {
        id: '215',
        name: 'Reno 10 Pro',
        children: [
          { id: '216', name: 'Glossy Purple' },
          { id: '217', name: 'Silvery Grey' },
        ],
      },
    ],
  },
  {
    id: '220',
    name: 'Sony',
    children: [
      {
        id: '221',
        name: 'Xperia 1 V',
        children: [
          { id: '222', name: 'Black' },
          { id: '223', name: 'Khaki Green' },
          { id: '224', name: 'Platinum Silver' },
        ],
      },
      {
        id: '225',
        name: 'Xperia 5 V',
        children: [
          { id: '226', name: 'Black' },
          { id: '227', name: 'Blue' },
        ],
      },
    ],
  },
];

new TreeSelect('#input', { data });
new TreeSelect('#single-select', { data });
new TreeSelect('#multi-select', { data });
