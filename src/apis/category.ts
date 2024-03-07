import { AxiosResponse } from 'axios';
import axiosInstance from './axiosConfig';
import { ICategory, IResponse } from '../Models/response';

export interface PayloadUpdateCategory {
  id: string;
  name?: string;
  isDeleted?: number;
}

export interface IMetaDataResponseCategoryForId {
  categories: ICategory[];
  breadCrum: {
    _id: string;
    name: string;
  }[];
}

class CategoryApi {
  static getCategories() {
    return axiosInstance.get<any, IResponse<ICategory[]>>('/admin/categories');
  }
  static getCategoryForId(id: string) {
    return axiosInstance.get<any, IResponse<IMetaDataResponseCategoryForId>>(
      '/admin/category/' + id
    );
  }
  static updateCategory(payload: PayloadUpdateCategory) {
    return axiosInstance.patch<any, IResponse<IMetaDataResponseCategoryForId>>(
      '/admin/category/',
      payload
    );
  }
}

export default CategoryApi;
