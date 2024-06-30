import { EnumCommon } from './common';

export interface PayloadCreateCategory {
  name: string;
  slug: string;
  status: '1' | '0';
  parentId?: string;
}
export interface PayloadUpdateCategory {
  id: string;
  name?: string;
  slug?: string;
  status?: '1' | '0';
  parentId?: string;
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
  status: number;
}
export interface PayloadUpdateProduct {
  id: string;
  name?: string;
  slug?: string;
  price?: string;
  detail?: string;
  categoryId?: string;
  status?: '0' | '1';
}
export interface PayloadDeleteUploadOptionProduct {
  optionId: string;
  uploadId: string;
}
export interface PayloadUpdateUploadOptionProduct {
  optionId: string;
  mediaUrls: { id: string; order: number }[];
}
