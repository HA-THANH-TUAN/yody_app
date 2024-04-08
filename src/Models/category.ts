export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId: null | string;
  isDeleted: boolean;
  urlImage: null | string;
  grade: number;
  createdAt: string;
  updatedAt: string;
}
