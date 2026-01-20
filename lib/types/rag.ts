export type RAGResponse = {
	answer: string;
	tier:
		| "tier1"
		| "tier2_evidence"
		| "tier2_compensation"
		| "tier3"
		| "standard";
	case_type: string | null;
	stage: string | null;
	citations: string[];
	clarification_needed?: {
		type: string;
		options: string[];
		reason: string;
	} | null;
	confidence: "high" | "medium" | "low";
};

export type RAGContext = {
	last_case_type: string | null;
	last_stage: string | null;
};

export type RAGRequest = {
	query: string;
	context?: RAGContext;
	no_llm?: boolean;
	verbose?: boolean;
};

export type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	tier?: RAGResponse["tier"];
	citations?: string[];
	clarification_needed?: RAGResponse["clarification_needed"];
	timestamp: number;
};
