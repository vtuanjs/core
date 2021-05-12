export type PartialDeep<T> = { [P in keyof T]?: PartialDeep<T[P]> };

export type FindAllOption = {
  fields: string;
  limit: number;
  page: number;
  sort: any;
};

export type FindAllResponse<T> = {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  data: T[];
};
