import { DefaultOptionType } from 'antd/es/select';
import slugify from 'slugify';

function genSlug(data: string) {
  return slugify(data, { lower: true, locale: 'vi' });
}

export const formatMoney = (value: number | string): string => {
  if (typeof value === 'number') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseJsonData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
export { genSlug };
