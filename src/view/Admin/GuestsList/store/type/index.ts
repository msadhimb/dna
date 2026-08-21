export type Guest = {
  id: string | number;
  name: string;
  email: string;
  [key: string]: unknown;
};

export type GuestsMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetGuestsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type GetGuestsResponse = {
  data: {
    guests: Guest[];
  };
  meta: GuestsMeta;
};

export type ImportGuestInput = {
  full_name: string;

  mantu_status?: boolean;
  unduh_mantu_status?: boolean;

};

export type GuestsListProps = {
  getGuestsData: (params: GetGuestsParams) => Promise<GetGuestsResponse>;
  deleteGuest: (id: string) => Promise<any>;
  importGuests: (guests: ImportGuestInput[]) => Promise<{
    success: boolean;
    inserted: number;
    updated: number;
    message?: string;
  }>;
};

