const API_URL = "http://192.168.1.21:3000";

export async function saveChiefComplaint(
  visitId: string,
  chiefComplaintId: string,
  answers: Record<string, any>
) {
  const response = await fetch(
    `${API_URL}/visits/${visitId}/chief-complaint`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chiefComplaintId,
        answers,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save complaint");
  }

  return response.json();
}