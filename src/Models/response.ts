import { ICategory } from './category';
import { EnumCommon } from './common';

export interface IResponse<D> extends ICommonResponse {
  metadata?: D;
}

export interface ICommonResponse {
  message: string;
  status: number;
}

export interface IShortCategory extends Pick<ICategory, '_id' | 'name' | 'slug' | 'grade'> {}
interface IMetadataCategory {
  category: ICategory;
  breadcrumb: IShortCategory[];
}

export interface IGetCategoriesResponse extends IResponse<ICategory[]> {}
export interface IGetCategoryResponse extends IResponse<IMetadataCategory> {}
