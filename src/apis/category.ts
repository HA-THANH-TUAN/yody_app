import { AxiosResponse } from 'axios';
import axiosInstance from './axiosConfig';
import { ICategoryResponse, IMetaDataResponseCategoryForId, IResponse } from '../Models/response';
import { PayloadUpdateCategory } from '../Models/request';

class CategoryApi {
  static getCategories() {
    return axiosInstance.get<any, IResponse<ICategoryResponse[]>>('/admin/categories');
  }
  static getCategoryForId(id: string) {
    return axiosInstance.get<any, IResponse<IMetaDataResponseCategoryForId>>('/admin/category/' + id);
  }
  static updateCategory(payload: PayloadUpdateCategory) {
    return axiosInstance.patch<any, IResponse<IMetaDataResponseCategoryForId>>('/admin/category/', payload);
  }
}

export default CategoryApi;
