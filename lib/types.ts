export interface Source {
	law: string;
	section: string;
	citation: string;
	text: string;
}

export interface LegalResponse {
	answer: string;
	legal_basis: string;
	procedure_steps?: string[];
	important_notes?: string[];
	sources: Source[];
	metadata: {
		category?: string;
		confidence?: number;
	};
}

export interface LegalQueryRequest {
	query: string;
	stream?: boolean;
}
