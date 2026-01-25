import { RAGRequest, RAGResponse } from "@/lib/types/rag";

const BASE_URL =
	process.env.NEXT_PUBLIC_RAG_API_BASE || "http://127.0.0.1:8000";

export async function queryRAG(request: RAGRequest): Promise<RAGResponse> {
	const response = await fetch(`${BASE_URL}/rag/query`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: request.query,
			context: request.context || {
				last_case_type: null,
				last_stage: null,
			},
			no_llm: request.no_llm ?? false,
			verbose: request.verbose ?? false,
		}),
	});

	if (!response.ok) {
		throw new Error(`RAG API error: ${response.statusText}`);
	}

	const data = await response.json();

	// Map backend response structure to frontend RAGResponse type
	return {
		answer: data.answer,
		tier: data.tier_info?.tier || "standard",
		case_type: data.tier_info?.case_type || null,
		stage: data.tier_info?.detected_stages?.[0] || null,
		citations: data.citations || [],
		clarification_needed: data.clarification_needed
			? {
					...data.clarification_needed,
					question:
						data.clarification_needed.question ||
						data.clarification_needed.reason ||
						"Please select an option to proceed:",
				}
			: null,
	};
}
