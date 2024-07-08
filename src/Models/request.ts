export interface CategoryCreationPayload {
  name: string;
  slug: string;
  parentId: string | null;
  status: 'active' | 'unactive';
}
export interface CategoryUpdatingPayload {
  _id: string;
  name?: string;
  slug?: string;
  parentId?: string | null;
  status?: 'active' | 'unactive';
}
