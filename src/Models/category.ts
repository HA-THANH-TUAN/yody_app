export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId: null | string;
  status: 0 | 1;
  urlImage: null | string;
  grade: number;
  createdAt: string;
  updatedAt: string;
}
