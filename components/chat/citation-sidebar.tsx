import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Source } from "@/lib/types";
import { BookOpen, Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

interface CitationSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	sources: Source[];
	activeCitationUid?: string | null;
}

export function CitationSidebar({
	open,
	onOpenChange,
	sources,
	activeCitationUid,
}: CitationSidebarProps) {
	// Local state to handle both programmatic and manual expansion
	const [expandedItem, setExpandedItem] = React.useState<string | undefined>(
		undefined,
	);

	// Sync activeCitationUid to local state
	React.useEffect(() => {
		if (activeCitationUid) {
			console.log(
				`[CitationSidebar] Syncing active citation: ${activeCitationUid}`,
			);
			setExpandedItem(`item-${activeCitationUid}`);
		}
	}, [activeCitationUid]);

	// Scroll to active citation when opened or when sources list updates
	React.useEffect(() => {
		if (open && activeCitationUid) {
			const tryScroll = () => {
				const element = document.getElementById(
					`source-${activeCitationUid}`,
				);
				console.log(
					`[CitationSidebar] Scroll attempt for: ${activeCitationUid}`,
					{ found: !!element },
				);

				if (element) {
					setTimeout(() => {
						console.log(
							`[CitationSidebar] Executing smooth scroll to: ${activeCitationUid}`,
						);
						element.scrollIntoView({
							behavior: "smooth",
							block: "start",
						});
					}, 100);
				}
			};

			// Small delay to ensure DOM has rendered new source if it was just added
			const timer = setTimeout(tryScroll, 150);
			return () => clearTimeout(timer);
		}
	}, [open, activeCitationUid, sources.length]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange} modal={false}>
			<SheetContent
				side="right"
				overlay={false}
				className="w-full sm:w-[500px] flex flex-col gap-0 p-0 font-inter border-l shadow-2xl bg-white dark:bg-zinc-950 opacity-100 h-full"
			>
				<SheetHeader className="p-6 border-b bg-muted/10 shrink-0">
					<SheetTitle className="flex items-center gap-2 font-playfair text-xl">
						<Scale className="h-5 w-5 text-primary" />
						Sources & Authorities
					</SheetTitle>
					<SheetDescription>
						Detailed legal references for this conversation.
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-hidden">
					<ScrollArea className="h-full px-6 py-4">
						{sources.length === 0 ? (
							<div className="text-center text-muted-foreground py-10">
								No sources recorded.
							</div>
						) : (
							<Accordion
								type="single"
								collapsible
								className="w-full space-y-4"
								value={expandedItem}
								onValueChange={setExpandedItem}
							>
								{sources.map((source) => (
									<SourceItem
										key={source.uid}
										source={source}
									/>
								))}
							</Accordion>
						)}
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	);
}

const SourceItem = React.memo(
	({ source }: { source: Source }) => {
		const itemId = `item-${source.uid}`;
		console.log(`[CitationSidebar] Rendering SourceItem: ${source.uid}`);
		return (
			<div id={`source-${source.uid}`} className="scroll-mt-4">
				<AccordionItem
					value={itemId}
					className="border rounded-lg px-4 bg-card shadow-sm hover:shadow-md transition-all"
				>
					<AccordionTrigger className="hover:no-underline py-3">
						<div className="flex flex-col items-start text-left gap-1 w-full">
							{/* Display Law Name & Section Title */}
							<span className="font-semibold text-primary text-sm flex items-center gap-2 w-full">
								<span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold min-w-[20px]">
									{source.chip_label || source.uid}
								</span>
								<span className="line-clamp-1">
									{source.law}
								</span>
							</span>
							<span className="text-xs text-muted-foreground font-medium w-full pl-7">
								{source.section}
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pt-2 pb-4 text-sm text-foreground/80 leading-relaxed">
						{/* Unique Identifier/Citation Code */}
						<div className="bg-muted/30 p-2 rounded border mb-2 font-mono text-xs text-muted-foreground inline-block">
							{source.citation}
						</div>
						{/* Full Text as Markdown */}
						<div className="pl-1 border-l-2 border-primary/20 prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted font-normal max-w-none">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{source.text}
							</ReactMarkdown>
						</div>
					</AccordionContent>
				</AccordionItem>
			</div>
		);
	},
	(prev, next) => prev.source.uid === next.source.uid,
);
