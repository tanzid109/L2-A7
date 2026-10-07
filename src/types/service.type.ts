import type { Service } from "./admin.type";
import type { ApiResponse } from "./api.type";
import type { PaginationMeta } from "./technician.type";

export interface ServiceParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetAllServicesResponse = ApiResponse<{
  meta: PaginationMeta;
  data: Service[];
}>;
