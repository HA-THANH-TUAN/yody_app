export interface IMediaUrlsProductColor {
  _id: string;
  url: string;
  status: 'success' | 'pending' | 'reject';
  type: 'image' | 'video';
}
export interface ISizeAmounts {
  amount: number;
  size: string;
  _id: string;
}
export interface IProductColor {
  _id: string;
  productId: string;
  color: string;
  colorCode: string;
  sizeAmounts: ISizeAmounts[];
  mediaUrls: IMediaUrlsProductColor[];
}
export interface IProduct {
  _id: string;
  name: string;
  typeSale: 'none' | 'hard' | 'percent';
  price: number;
  categoryId: string;
  status: 'published' | 'unPublished';
  slug: string;
  detail: null | string;
  productColorId: string;
  createdAt: string;
}
