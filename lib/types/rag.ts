export type SourceType =
	| "general_sop"
	| "sop"
	| "bnss"
	| "bns"
	| "bsa"
	| "evidence"
	| "compensation";

export interface StructuredCitation {
	source_type: SourceType;
	source_id: string;
	display: string;
	context_snippet?: string;
	relevance_score?: number;
}

export type TimelineItem = {
	stage: string;
	action: string;
	deadline: string | null;
	mandatory: boolean;
	legal_basis: string[];
	is_anchor?: boolean;
	audience?: "victim" | "police" | "court";
};

export interface AnswerSentence {
	sid: string;
	text: string;
}

export interface SentenceCitations {
	sentences: AnswerSentence[];
	mapping: Record<string, string[]>; // sid -> ["source_type:source_id", ...]
}

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
	citations: StructuredCitation[];
	sentence_citations?: SentenceCitations;
	timeline: TimelineItem[];
	clarification_needed?: {
		type: string;
		options: string[];
		question: string;
	} | null;
	confidence?: "high" | "medium" | "low";
	system_notice?: {
		level: "warning" | "info";
		message: string;
	} | null;
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
	citations?: StructuredCitation[];
	sentence_citations?: SentenceCitations;
	timeline?: TimelineItem[];
	clarification_needed?: RAGResponse["clarification_needed"];
	confidence?: RAGResponse["confidence"];
	system_notice?: RAGResponse["system_notice"];
	timestamp: number;
};

export interface HighlightRange {
	start: number;
	end: number;
	reason: string;
}

export type SourceRequest = {
	source_type: SourceType;
	source_id: string;
	highlight_snippet?: string;
};

export type SourceResponse = {
	source_type: string;
	doc_id?: string;
	title: string;
	section_id: string | null;
	content: string;
	legal_references: string[];
	last_updated?: string;
	highlights?: HighlightRange[];
	metadata?: {
		procedural_stage?: string;
		stakeholders?: string[];
		action_type?: string;
		time_limit?: string;
		sop_group?: string;
		priority?: number;
	};
};
