import { EnumCommon } from './common';

export interface PayloadUpdateCategory {
  id: string;
  name?: string;
  isDeleted?: number;
}

export interface PayloadGetProducts {
  search?: string;
  page: number;
  limit: number;
  status?: string;
  categories?: string;
}
export interface PayloadUploadProduct {
  // productId: string;
  // color: string;
  // colorCode: string;
  // size: string;
  // amount: string;
  // files: File;
}
export interface PayloadCreateProduct {
  name: string;
  slug: string;
  price: string;
  detail?: string;
  categoryId: string;
  status: EnumCommon['statusProduct'];
}
export interface PayloadDeleteUploadOptionProduct {
  optionId: string;
  uploadId: string;
}
