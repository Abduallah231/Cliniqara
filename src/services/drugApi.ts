import { api } from "./api";

// ======================================================
// Drug
// ======================================================

export type Drug = {
  id: string;

  commercialNameEn: string;
  commercialNameAr: string | null;

  scientificName: string | null;
  manufacturer: string | null;
  drugClass: string | null;
  route: string | null;

  priceEgp: number | string | null;
};

// ======================================================
// Drug Search
// ======================================================

export type DrugSearchResponse = {
  data: Drug[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ======================================================
// API
// ======================================================

export async function searchDrugs(
  q: string,
  page = 1,
  limit = 20,
): Promise<DrugSearchResponse> {
  const { data } = await api.get(
    "/drugs/search",
    {
      params: {
        q,
        page,
        limit,
      },
    },
  );

  return data;
}

export async function getDrugById(
  id: string,
): Promise<Drug> {
  const { data } = await api.get(
    `/drugs/${id}`,
  );

  return data;
}