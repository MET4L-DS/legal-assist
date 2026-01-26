"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Loader2,
	BookOpen,
	Scale,
	FileText,
	Copy,
	Check,
	ExternalLink,
} from "lucide-react";
import { StructuredCitation, SourceResponse } from "@/lib/types/rag";
import { fetchSource } from "@/lib/api/rag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SourceViewerProps {
	isOpen: boolean;
	onClose: () => void;
	citation: StructuredCitation | null;
}

export function SourceViewer({ isOpen, onClose, citation }: SourceViewerProps) {
	const [data, setData] = useState<SourceResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (isOpen && citation) {
			loadSource(citation);
		} else {
			// Reset state when closed
			setData(null);
			setError(null);
			setLoading(false);
		}
	}, [isOpen, citation]);

	const loadSource = async (cit: StructuredCitation | null) => {
		if (!cit) return;
		console.log("🔍 [SourceViewer] Loading source for:", cit.display);

		const req = { source_type: cit.source_type, source_id: cit.source_id };
		console.log("🧩 [SourceViewer] Request:", req);

		setLoading(true);
		setError(null);

		try {
			console.log("🚀 [SourceViewer] Calling API...");
			const result = await fetchSource(req);
			console.log("✅ [SourceViewer] API success:", result);
			setData(result);
		} catch (err) {
			console.error("❌ [SourceViewer] API failed:", err);
			setError("Failed to fetch source content.");
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = () => {
		if (data?.content) {
			navigator.clipboard.writeText(data.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
				<DialogHeader className="p-6 pb-2 border-b bg-slate-50 dark:bg-slate-900/50">
					<div className="flex items-center gap-2 mb-2">
						<Badge variant="outline" className="bg-white">
							{data?.source_type
								.replace(/_/g, " ")
								.toUpperCase() || "SOURCE"}
						</Badge>
						{data?.last_updated && (
							<span className="text-[10px] text-muted-foreground">
								Updated: {data.last_updated}
							</span>
						)}
					</div>
					<DialogTitle className="leading-snug">
						{loading
							? "Fetching Source..."
							: data?.title || citation?.display}
					</DialogTitle>
					<DialogDescription className="text-xs truncate">
						{data?.section_id || "Loading..."}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-hidden relative bg-white dark:bg-slate-950">
					{loading && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-[1px] z-10">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-xs text-muted-foreground mt-2">
								Retrieving verbatim text...
							</p>
						</div>
					)}

					{error ? (
						<div className="p-8 text-center text-red-500 text-sm">
							<p>{error}</p>
							<Button
								variant="outline"
								size="sm"
								className="mt-4"
								onClick={() => loadSource(citation)}
							>
								Retry
							</Button>
						</div>
					) : (
						<ScrollArea className="h-full p-6 text-sm leading-relaxed whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300">
							{data?.content}
						</ScrollArea>
					)}
				</div>

				<div className="p-3 border-t bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
					<div className="flex gap-2 text-xs text-muted-foreground">
						{data?.legal_references?.map((ref, i) => (
							<span
								key={i}
								className="flex items-center gap-1 bg-slate-200/50 px-1.5 py-0.5 rounded"
							>
								<Scale className="h-3 w-3" /> {ref}
							</span>
						))}
					</div>
					<Button
						size="sm"
						variant="ghost"
						onClick={handleCopy}
						disabled={loading || !data}
						className="ml-auto"
					>
						{copied ? (
							<>
								<Check className="h-4 w-4 mr-2" /> Copied
							</>
						) : (
							<>
								<Copy className="h-4 w-4 mr-2" /> Copy Text
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
