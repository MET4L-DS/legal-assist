"use client";

import * as React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, Scale, Clock, BookOpen, Loader2 } from "lucide-react";
import { SourceResponse, HighlightRange } from "@/lib/types/rag";
import { cn } from "@/lib/utils";

export type CachedSource = SourceResponse & {
	fetched_at: number;
	key: string;
};

interface SourceSidePanelProps {
	isOpen: boolean;
	onClose: () => void;
	sources: Record<string, CachedSource>;
	activeSourceKey: string | null;
	onSourceSelect: (key: string) => void;
	isLoading?: boolean;
}

export function SourceSidePanel({
	isOpen,
	onClose,
	sources,
	activeSourceKey,
	onSourceSelect,
	isLoading,
}: SourceSidePanelProps) {
	// If closed, render nothing or hidden div?
	// Better to render a hidden div or use transition classes to animate width.
	// For simplicity in step 1: absolute positioning or conditional rendering.
	// We'll use conditional class for width transition.

	const sourceKeys = Object.keys(sources);

	// Auto-scroll to highlighted element when accordion opens
	const contentRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (activeSourceKey && isOpen) {
			// Logic to find the mark and scroll could go here
			// But shadcn accordion handles expansion animation, might need delay
			setTimeout(() => {
				const mark = contentRef.current?.querySelector("mark");
				mark?.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 300);
		}
	}, [activeSourceKey, isOpen]);

	// if (!isOpen && sourceKeys.length === 0) return null; // Keep rendered for transition

	return (
		<div
			className={cn(
				"absolute inset-y-0 right-0 z-50 flex flex-col border-l bg-background shadow-lg transition-all duration-300 ease-in-out font-sans",
				isOpen
					? "w-full sm:w-[400px] translate-x-0"
					: "w-0 translate-x-full opacity-0 pointer-events-none",
			)}
		>
			<div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50 dark:bg-slate-900/50">
				<div className="flex items-center gap-2">
					<BookOpen className="h-4 w-4 text-primary" />
					<h3 className="font-semibold text-sm">References</h3>
					<Badge
						variant="secondary"
						className="text-[10px] h-5 px-1.5 min-w-[1.25rem] justify-center"
					>
						{sourceKeys.length}
					</Badge>
				</div>
				<div className="flex items-center gap-1">
					{isLoading && (
						<Loader2 className="h-3 w-3 animate-spin text-muted-foreground mr-2" />
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-7 w-7"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<ScrollArea
				className="flex-1 p-0 bg-slate-50/50 dark:bg-slate-950/50"
				ref={contentRef}
			>
				{sourceKeys.length === 0 && !isLoading ? (
					<div className="flex h-[80vh] flex-col items-center justify-center text-muted-foreground opacity-50 px-8 text-center">
						<BookOpen className="mb-4 h-10 w-10 text-slate-300" />
						<p className="text-sm">No citations loaded.</p>
						<p className="text-xs mt-1">
							Click a citation in the chat to view the source text
							here.
						</p>
					</div>
				) : (
					<Accordion
						type="single"
						collapsible
						value={activeSourceKey || ""}
						onValueChange={onSourceSelect}
						className="w-full"
					>
						{Object.values(sources).map((src) => (
							<AccordionItem
								key={src.key}
								value={src.key}
								className="border-b bg-background last:border-0"
							>
								<AccordionTrigger className="hover:no-underline py-3 px-4 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900/50">
									<div className="flex flex-col items-start text-left gap-1 w-full overflow-hidden">
										<div className="flex items-center gap-2 w-full">
											<Badge
												variant="outline"
												className="shrink-0 text-[10px] uppercase bg-white"
											>
												{src.source_type.replace(
													/_/g,
													" ",
												)}
											</Badge>
											<span className="truncate text-xs text-muted-foreground font-mono">
												{src.section_id}
											</span>
										</div>
										<span className="text-sm font-medium leading-tight line-clamp-2">
											{src.title}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="p-0">
									<div className="p-4 pt-2 text-sm font-mono leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
										{renderHighlightedContent(
											src.content,
											src.highlights,
										)}
									</div>
									<div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t flex flex-wrap gap-2">
										{src.legal_references.map((ref, i) => (
											<Badge
												key={i}
												variant="secondary"
												className="text-[10px] bg-white border"
											>
												<Scale className="mr-1 h-3 w-3" />
												{ref}
											</Badge>
										))}
										{src.last_updated && (
											<Badge
												variant="outline"
												className="text-[10px] ml-auto bg-white"
											>
												<Clock className="mr-1 h-3 w-3" />
												{src.last_updated}
											</Badge>
										)}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				)}
			</ScrollArea>
		</div>
	);
}

function renderHighlightedContent(
	content: string,
	highlights?: HighlightRange[],
) {
	if (!highlights || highlights.length === 0) return content;

	// Sort highlights by start position
	const sorted = [...highlights].sort((a, b) => a.start - b.start);
	const segments: React.ReactNode[] = [];
	let lastIndex = 0;

	sorted.forEach((h, i) => {
		// Text before highlight
		if (h.start > lastIndex) {
			segments.push(
				<span key={`text-${i}`}>
					{content.slice(lastIndex, h.start)}
				</span>,
			);
		}

		// Highlighted text
		segments.push(
			<mark
				key={`mark-${i}`}
				className="bg-yellow-200 dark:bg-yellow-900/50 rounded-sm px-0.5 text-slate-900 dark:text-slate-100 font-semibold"
				title={h.reason}
			>
				{content.slice(h.start, h.end)}
			</mark>,
		);

		lastIndex = h.end;
	});

	// Remaining text
	if (lastIndex < content.length) {
		segments.push(<span key="text-end">{content.slice(lastIndex)}</span>);
	}

	return <>{segments}</>;
}
