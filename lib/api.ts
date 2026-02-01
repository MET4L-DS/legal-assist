import { LegalQueryRequest, LegalResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchLegalAnswer(query: string): Promise<LegalResponse> {
	const response = await fetch(`${API_BASE_URL}/api/v1/query`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, stream: false } as LegalQueryRequest),
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}
