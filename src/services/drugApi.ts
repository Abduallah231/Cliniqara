import drugCatalog from "@/data/egyptian-drugs.json";

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
  const query = q.trim().toLocaleLowerCase();
  const matches = (drugCatalog as Drug[]).filter((drug) =>
    !query || [drug.commercialNameEn, drug.commercialNameAr, drug.scientificName]
      .some((value) => value?.toLocaleLowerCase().includes(query)),
  );
  const start = Math.max(0, page - 1) * limit;
  return {
    data: matches.slice(start, start + limit),
    meta: { page, limit, total: matches.length, totalPages: Math.ceil(matches.length / limit) },
  };
}

export async function getDrugById(
  id: string,
): Promise<Drug> {
  const drug = (drugCatalog as Drug[]).find((item) => item.id === id);
  if (!drug) throw new Error("Drug not found in the offline catalogue");
  return drug;
}
