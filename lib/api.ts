import { LegalQueryRequest, LegalResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchLegalAnswer(query: string): Promise<LegalResponse> {
	console.log("[API] Fetching legal answer for query:", query);

	const response = await fetch(`${API_BASE_URL}/api/v1/query`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, stream: false } as LegalQueryRequest),
	});

	console.log(
		`[API] Response status: ${response.status} ${response.statusText}`,
	);

	if (!response.ok) {
		console.error("[API] Error fetching answer:", response.statusText);
		throw new Error(`API Error: ${response.statusText}`);
	}

	const data = await response.json();
	console.log("[API] Received data:", data);
	return data;
}
