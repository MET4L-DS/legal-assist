export interface Source {
	law: string;
	section: string;
	citation: string;
	text: string;
}

export interface LegalResponse {
	answer: string;
	safety_alert?: string;
	immediate_action_plan?: string[];
	legal_basis: string;
	procedure_steps?: string[];
	sources: Source[];
	metadata: {
		intent?: string;
		user_context?: "victim_distress" | "professional" | "informational";
		category?: string;
		confidence?: number;
	};
}

export interface LegalQueryRequest {
	query: string;
	stream?: boolean;
}
