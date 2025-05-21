import { SORT_ORDER } from '../constants/request.constants';

export type SortOrderType = typeof SORT_ORDER.ASC | typeof SORT_ORDER.DESC;

export type BusinessIdOptionsType = {
  businessId?: string;
};

export type PaginationOptionsType = {
  page?: number;
  pageSize?: number;
};

export type SortingOptionsType = {
  sortBy?: string;
  sortOrder?: SortOrderType;
};

export type FindOptionsType = PaginationOptionsType &
  SortingOptionsType &
  BusinessIdOptionsType;
