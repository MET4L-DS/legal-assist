export interface Source {
	uid: string; // "BNS_115"
	chip_label: string; // "[BNS:115]"
	id?: number; // Deprecated
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
