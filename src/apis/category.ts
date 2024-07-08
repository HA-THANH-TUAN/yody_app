import axiosInstance from './axiosConfig';
import { CategoryCreationPayload, CategoryUpdatingPayload } from '../Models/request';
import { ICommonResponse, IGetCategoriesResponse, IGetCategoryResponse } from '../Models/response';

class CategoryApi {
  static createCategory(data: CategoryCreationPayload) {
    return axiosInstance.post<any, ICommonResponse>('/create-category', data);
  }
  static getCategories() {
    return axiosInstance.get<any, IGetCategoriesResponse>('/get-categories');
  }
  static getCategory(id: string) {
    return axiosInstance.get<any, IGetCategoryResponse>('/get-category/' + id);
  }
  static updateCategory(data: CategoryUpdatingPayload) {
    return axiosInstance.patch<any, ICommonResponse>('/update-category', data);
  }
}
export default CategoryApi;
