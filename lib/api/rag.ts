import {
	RAGRequest,
	RAGResponse,
	SourceRequest,
	SourceResponse,
} from "@/lib/types/rag";

const BASE_URL =
	process.env.NEXT_PUBLIC_RAG_API_BASE || "http://127.0.0.1:8000";

export async function queryRAG(request: RAGRequest): Promise<RAGResponse> {
	console.log(`📡 [API] queryRAG to ${BASE_URL}/rag/query`, request);
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
	console.log("📡 [API] queryRAG Response payload:", data);

	// Map backend response structure to frontend RAGResponse type
	return {
		answer: data.answer,
		tier: data.tier_info?.tier || "standard",
		case_type: data.tier_info?.case_type || null,
		stage: data.tier_info?.detected_stages?.[0] || null,
		citations: data.citations || [],
		sentence_citations: data.sentence_citations || null,
		answer_units: data.answer_units || null,
		timeline: data.timeline || [],
		clarification_needed: data.clarification_needed
			? {
					...data.clarification_needed,
					question:
						data.clarification_needed.question ||
						data.clarification_needed.reason ||
						"Please select an option to proceed:",
				}
			: null,
		confidence: data.confidence || "high",
		system_notice: data.system_notice || null,
	};
}

export async function fetchSource(
	request: SourceRequest,
): Promise<SourceResponse> {
	console.log(`📡 [API] fetchSource to ${BASE_URL}/rag/source`, request);
	try {
		const response = await fetch(`${BASE_URL}/rag/source`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		console.log(`📡 [API] Response status: ${response.status}`);

		if (response.status === 404) {
			console.warn("Source endpoint not found (404). Using mock data.");
			return getMockSource(request);
		}

		if (!response.ok) {
			throw new Error(`Source API error: ${response.statusText}`);
		}

		const data = await response.json();
		console.log("📡 [API] Response payload:", data);
		return data;
	} catch (error) {
		console.warn("Error fetching source, using mock data:", error);
		return getMockSource(request);
	}
}

function getMockSource(request: SourceRequest): SourceResponse {
	return {
		source_type: request.source_type,
		title: `Mock Source: ${request.source_id}`,
		section_id: request.source_id,
		content: `[MOCK CONTENT - BACKEND ENDPOINT NOT FOUND]\n\nThis is a placeholder because the backend endpoint "/rag/source" returned 404 or failed.\n\nIn a real scenario, this would contain the verbatim legal text for ${request.source_id}. For now, we are simulating the response to allow UI verification.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
		legal_references: ["BNSS Section 100", "BNS Section 45"],
		last_updated: "2024-01-26",
		metadata: {
			procedural_stage: "pre_fir",
			stakeholders: ["citizen", "victim"],
			action_type: "right",
			time_limit: "immediately",
			sop_group: "complaint",
			priority: 2,
		},
	};
}
