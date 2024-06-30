import { AxiosResponse } from 'axios';
import axiosInstance from './axiosConfig';
import { ICategoryResponse, ICommonResponse, IMetaDataResponseCategory, IResponse } from '../Models/response';
import { PayloadCreateCategory, PayloadUpdateCategory } from '../Models/request';

class CategoryApi {
  static getCategories() {
    return axiosInstance.get<any, IResponse<ICategoryResponse[]>>('/admin/categories');
  }
  static createCategory(data: PayloadCreateCategory) {
    return axiosInstance.post<any, ICommonResponse>('/admin/category', data);
  }
  static getCategoryForId(id: string) {
    return axiosInstance.get<any, IResponse<IMetaDataResponseCategory>>('/admin/category/' + id);
  }
  static updateCategory(payload: PayloadUpdateCategory) {
    return axiosInstance.patch<any, IResponse<IMetaDataResponseCategory>>('/admin/category/', payload);
  }
  static deleteCategory(id: string) {
    return axiosInstance.delete<any, ICommonResponse>('/admin/category/' + id);
  }
}

export default CategoryApi;
