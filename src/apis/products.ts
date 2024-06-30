import {
  PayloadCreateProduct,
  PayloadDeleteUploadOptionProduct,
  PayloadUpdateProduct,
  PayloadUpdateUploadOptionProduct
} from '../Models/request';
import {
  ICommonResponse,
  IMetaDataResponseCreateProduct,
  IMetaDataResponseGetProducts,
  IMetaDataResponseGetSeoProduct,
  IProuductsMetaData,
  IResponse
} from '../Models/response';
import axiosInstance from './axiosConfig';
class ProductApi {
  static getProducts(query: string) {
    return axiosInstance.get<any, IResponse<IMetaDataResponseGetProducts>>(
      `/admin/products${query.length > 0 ? `?${query}` : ''}`
    );
  }
  static getProduct(id: string) {
    return axiosInstance.get<any, IResponse<IProuductsMetaData>>(`/admin/product/${id}`);
  }
  static createProduct(payload: PayloadCreateProduct) {
    return axiosInstance.post<any, IResponse<IMetaDataResponseCreateProduct>>(`/admin/product`, payload);
  }
  static updateProduct(payload: PayloadUpdateProduct) {
    return axiosInstance.patch<any, IResponse<ICommonResponse>>(`/admin/product`, payload);
  }
  static uploadProduct(payload: FormData) {
    return axiosInstance.post<any, IResponse<IMetaDataResponseCreateProduct>>(`/admin/upload-product`, payload);
  }
  static updateOptionProduct(payload: PayloadUpdateOptionProduct) {
    return axiosInstance.patch<any, ICommonResponse>(`/admin/product/option/`, payload);
  }
  static deleteOptionProduct(optionId: string) {
    return axiosInstance.delete<any, ICommonResponse>(`/admin/product/option/${optionId}`);
  }
  static addUploadOption(optionId: string, formData: FormData) {
    return axiosInstance.patch<any, ICommonResponse>(`admin/product/add-upload-option/${optionId}`, formData);
  }
  static addSizeAmountOption(payload: PayloadAddSizeAmountOption) {
    return axiosInstance.patch<any, ICommonResponse>(`admin/product/add-size-amount-option`, payload);
  }
  static deleteSizeAmountOption(payload: PayloadDeleteSizeAmountOption) {
    return axiosInstance.patch<any, ICommonResponse>(`/admin/product/delete-size-amount-option`, payload);
  }
  static updateSizeAmountOption(payload: PayloadUpdateSizeAmountOption) {
    return axiosInstance.patch<any, ICommonResponse>(`/admin/product/update-size-amount-option`, payload);
  }
  static deleteUploadOptionProduct(payload: PayloadDeleteUploadOptionProduct) {
    return axiosInstance.patch<any, ICommonResponse>(`/admin/product/delete-upload-option`, payload);
  }
  static updateUploadOptionProduct(payload: PayloadUpdateUploadOptionProduct) {
    return axiosInstance.patch<any, ICommonResponse>(`/admin/product/update-mediaUrl`, payload);
  }
  // meta seo
  static getMetaSeoProduct(id: string) {
    return axiosInstance.get<any, IResponse<IMetaDataResponseGetSeoProduct>>(`/admin/product/meta-seo/${id}`);
  }
}
export default ProductApi;

export interface PayloadAddSizeAmountOption {
  optionId: string;
  sizeAmounts: {
    size: string;
    amount: number;
    order: number;
  }[];
}

export interface PayloadUpdateOptionProduct {
  optionId: string;
  updateData: {
    color?: string;
    order?: number;
    colorCode?: string;
  };
}
export interface PayloadDeleteSizeAmountOption {
  optionId: string;
  sizeAmountIds: string[];
}

export interface PayloadUpdateSizeAmountOption {
  optionId: string;
  sizeAmounts: {
    id: string;
    size?: string;
    amount?: number;
    order?: number;
  }[];
}
