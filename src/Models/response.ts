import { ICategory } from './category';
import { EnumCommon } from './common';
import { IProduct, IProductColor } from './product';

export interface IResponse<D> extends ICommonResponse {
  metadata?: D;
}

export interface ICommonResponse {
  message: string;
  status: number;
}
export interface ICategoryResponse extends ICategory {
  categories?: ICategory[];
}
export interface IMetaDataResponseCategory {
  categories: ICategoryResponse[];
  breadCrum: {
    _id: string;
    name: string;
  }[];
}

export interface IProuductsMetaData extends IProduct {
  category: ICategory;
  productColors: IProductColor[];
}

export interface IMetaDataResponseGetProducts {
  products: IProuductsMetaData[];
  panigation: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IMetaDataResponseCreateProduct {
  name: string;
  typeSale: EnumCommon['typeSale'];
  price: number;
  categoryId: string;
  status: EnumCommon['statusProduct'];
  _id: string;
  slug: string;
  detail: null | string;
  productColorId: null | string;
  createdAt: string;
}

export interface IMetaDataResponseGetSeoProduct extends IProduct {
  productColors: IProductColor[];
}
