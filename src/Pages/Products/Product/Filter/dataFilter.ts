import { IDataCheckBox } from './DropdownFilter';

export const dataFilterProductStatus: IDataCheckBox[] = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: '1',
    title: 'Publish'
  },
  {
    value: '0',
    title: 'UnPublish'
  }
];
export const dataFilterCategory: IDataCheckBox[] = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: 'has',
    title: 'Has Category',
    childs: [
      {
        value: 'all',
        title: 'All'
      },
      {
        value: '1',
        title: 'Publish'
      },
      {
        value: '0',
        title: 'UnPublish'
      }
    ]
  },
  {
    value: 'none',
    title: 'None Category'
  }
];
export const dataFilterCategoryStatus: IDataCheckBox[] = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: '1',
    title: 'Category Active'
  },
  {
    value: '0',
    title: 'Category Unactive'
  }
];
export const dataFilterOptionStatus: IDataCheckBox[] = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: 'has',
    title: 'Has Option',
    childs: [
      {
        value: 'all',
        title: 'All'
      },
      {
        value: '1',
        title: 'Sold Out'
      },
      {
        value: '0',
        title: 'None Sold Out'
      }
    ]
  },
  {
    value: 'none',
    title: 'None Option'
  }
];
export const dataFilterProductSeo: IDataCheckBox[] = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: 'has',
    title: 'Has Seo'
  },
  {
    value: 'none',
    title: 'None Seo'
  }
];
