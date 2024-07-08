export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  status: 'unactive' | 'active';
  grade: number;
  parentId: string | null;
  urlImage: null | string;
  createdAt: string;
  updatedAt: string;
  categories: ICategory[] | null;
}
