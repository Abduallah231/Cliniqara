const API_URL = "http://192.168.1.21:3000";

export async function getChiefComplaints(search?: string) {
  const url = new URL(`${API_URL}/chief-complaints`);

  if (search) {
    url.searchParams.set("search", search);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to load chief complaints");
  }

  return response.json();
}

export async function getChiefComplaintTemplate(id: string) {
  const response = await fetch(
    `${API_URL}/chief-complaints/${id}/template`,
  );

  if (!response.ok) {
    throw new Error("Failed to load template");
  }

  return response.json();
}