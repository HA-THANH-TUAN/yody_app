type SizeName = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | '2-3' | '4-5' | '6-7' | '8-9';
type GenderProduct = 'male' | 'female' | 'all';
type StatusProduct = 'active' | 'unactive';
type BreadCrumbCategory = string[];

export interface IBaseProduct {
  _id: string;
  name: string;
  slug: string;
  originPrice: number;
  status: StatusProduct;
  categoryId: string;
  description: null | string;
  createdAt: string;
  updatedAt: string;
  gender: GenderProduct;
}
export interface IVariantProduct {
  _id: string;
  variantProductCode: string;
  colorName: string;
  productId: string;
  colorCode: string;
  mediaUrls: IMediaUrl[];
  sizeAmounts: ISizeAmount[];
}
export interface IMediaUrl {
  _id: string;
  variantProductId: string;
  status: StatusProduct;
  order: number;
  url: string | null;
  publicKey: string | null;
  type: string | null;
}

export interface ISizeAmount {
  _id: string;
  variantProductId: string;
  sizeName: SizeName;
  amount: number;
  order: number;
}

export interface IProduct extends IBaseProduct {
  variants: IVariantProduct[];
  breadCrumbCategory?: BreadCrumbCategory;
}
