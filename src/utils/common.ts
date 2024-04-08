import { DefaultOptionType } from 'antd/es/select';
import slugify from 'slugify';
import { ICategoryResponse } from '../Models/response';

function genSlug(data: string) {
  return slugify(data, { lower: true, locale: 'vi' });
}

export const recurtiveCat = (
  result: DefaultOptionType[] = [],
  cates: ICategoryResponse[],
  grade = 0,
  parentIndex?: string
) => {
  if (!(cates === undefined || cates.length === 0)) {
    cates.forEach((val, i) => {
      result.push({
        label: `${parentIndex === undefined ? '' : parentIndex}${i + 1}$${val.name}`,
        value: val._id
      });
      if (val.categories) {
        const prefix = `${parentIndex ? parentIndex : ''}${i + 1}.`;
        recurtiveCat(result, val.categories, grade + 1, prefix);
      }
    });
  }
  return result;
};

export const formatMoney = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
export { genSlug };
