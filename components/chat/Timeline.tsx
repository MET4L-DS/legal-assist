"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
	Clock,
	AlertCircle,
	Briefcase,
	FileText,
	Info,
	ChevronDown,
	Copy,
	Check,
} from "lucide-react";
import { TimelineItem } from "@/lib/types/rag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineProps {
	items: TimelineItem[];
	confidence?: "high" | "medium" | "low";
}

export function Timeline({ items, confidence }: TimelineProps) {
	const [isProceduralOpen, setIsProceduralOpen] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	if (!items || items.length === 0) return null;

	const showWarning = confidence === "medium" || confidence === "low";

	// Split items based on audience and anchor status
	const victimCritical = items.filter(
		(i) => i.is_anchor && i.audience === "victim",
	);
	const proceduralSteps = items.filter(
		(i) => !(i.is_anchor && i.audience === "victim"),
	);

	const handleCopy = () => {
		const lines: string[] = [];

		if (victimCritical.length > 0) {
			lines.push("CRITICAL ACTIONS (YOU):");
			victimCritical.forEach((i) => {
				lines.push(
					`[ ] ${i.action}${i.deadline ? ` (Due: ${i.deadline})` : ""}`,
				);
			});
			lines.push("");
		}

		if (proceduralSteps.length > 0) {
			lines.push("PROCEDURAL STEPS:");
			proceduralSteps.forEach((i) => {
				lines.push(`[ ] ${i.action} (${i.stage})`);
			});
			lines.push("");
		}

		if (showWarning) {
			lines.push(
				"NOTE: Some procedural steps may vary by facts or jurisdiction.",
			);
		}

		navigator.clipboard.writeText(lines.join("\n"));
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<div className="flex flex-col gap-4 mb-4 relative group">
			{/* Copy Button */}
			<div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button
					variant="secondary"
					size="icon"
					className="h-6 w-6 rounded-full shadow-sm bg-background/80 backdrop-blur border"
					onClick={handleCopy}
					title="Copy checklist"
				>
					{isCopied ? (
						<Check className="h-3 w-3 text-green-600" />
					) : (
						<Copy className="h-3 w-3 text-muted-foreground" />
					)}
				</Button>
			</div>

			{/* Critical Victim Actions - High Visibility (Red) */}
			{victimCritical.length > 0 && (
				<div className="bg-red-50/50 dark:bg-red-950/10 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm overflow-hidden">
					<div className="sticky top-0 z-10 bg-red-50/95 dark:bg-red-950/95 backdrop-blur supports-[backdrop-filter]:bg-red-50/50 p-4 border-b border-red-100/50 dark:border-red-900/50">
						<div className="flex items-center gap-2 text-red-700 dark:text-red-400">
							<Clock className="w-4 h-4" />
							<span className="text-xs font-bold uppercase tracking-wider">
								Critical Actions (You)
							</span>
						</div>
					</div>
					<div className="p-4 pt-4">
						<div className="relative border-l-2 border-red-200 dark:border-red-900 pl-4 ml-2 space-y-6">
							{victimCritical.map((item, idx) => (
								<TimelineItemRow
									key={`crit-${idx}`}
									item={item}
									variant="critical"
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{/* System/Procedural Steps - Demoted Visibility (Gray/Slate) */}
			{proceduralSteps.length > 0 && (
				<Collapsible
					open={isProceduralOpen}
					onOpenChange={setIsProceduralOpen}
					className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800"
				>
					<div className="p-4 flex items-center justify-between">
						<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
							<Briefcase className="w-4 h-4" />
							<TooltipProvider>
								<Tooltip delayDuration={300}>
									<TooltipTrigger asChild>
										<span className="text-xs font-semibold uppercase tracking-wider border-b border-dotted border-slate-400 cursor-help">
											Procedural Steps (Police/Court)
										</span>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="max-w-[220px] text-xs"
									>
										<p>
											Procedural steps are handled by
											authorities, not actions required
											from you.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="p-0 h-6 w-6 hover:bg-slate-200/50 dark:hover:bg-slate-800"
							>
								<ChevronDown
									className={cn(
										"h-4 w-4 transition-transform duration-200",
										isProceduralOpen ? "rotate-180" : "",
									)}
								/>
								<span className="sr-only">
									Toggle procedural steps
								</span>
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent>
						<div className="p-4 pt-0">
							<div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-4">
								{proceduralSteps.map((item, idx) => (
									<TimelineItemRow
										key={`proc-${idx}`}
										item={item}
										variant="procedural"
									/>
								))}
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>
			)}

			{/* Confidence Messaging Warning */}
			{showWarning && (
				<div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-2.5 rounded-md text-xs border border-amber-100 dark:border-amber-900/50">
					<Info className="w-4 h-4 shrink-0 mt-0.5" />
					<p className="leading-relaxed opacity-90">
						Some procedural steps may vary by facts or jurisdiction.
					</p>
				</div>
			)}
		</div>
	);
}

function TimelineItemRow({
	item,
	variant,
}: {
	item: TimelineItem;
	variant: "critical" | "procedural";
}) {
	const isCritical = variant === "critical";

	return (
		<div className="relative">
			<div
				className={cn(
					"absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950",
					isCritical
						? "bg-red-600 dark:bg-red-500"
						: "bg-slate-400 dark:bg-slate-600",
				)}
			/>
			<div className="flex flex-col gap-1">
				<div className="flex items-start justify-between gap-2">
					<span
						className={cn(
							"text-sm font-medium leading-tight",
							isCritical
								? "text-red-900 dark:text-red-200"
								: "text-slate-700 dark:text-slate-300",
						)}
					>
						{item.action}
					</span>
					{item.deadline && (
						<Badge
							variant="outline"
							className={cn(
								"text-[10px] whitespace-nowrap h-5 px-1.5 shrink-0",
								isCritical
									? "border-red-200 text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
									: "border-slate-200 text-slate-600 bg-white dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
							)}
						>
							<Clock className="w-3 h-3 mr-1 inline-block" />
							{item.deadline}
						</Badge>
					)}
				</div>

				<div className="flex flex-wrap gap-2 text-xs text-muted-foreground items-center">
					<Badge
						variant="secondary"
						className={cn(
							"text-[10px] font-normal px-1 py-0 h-5",
							isCritical
								? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
								: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
						)}
					>
						{item.stage.replace(/_/g, " ")}
					</Badge>

					{item.legal_basis.length > 0 && (
						<span className="italic opacity-80 flex items-center gap-1">
							<FileText className="w-3 h-3" />
							{item.legal_basis[0]}
							{item.legal_basis.length > 1 &&
								` +${item.legal_basis.length - 1}`}
						</span>
					)}
				</div>

				{item.mandatory && isCritical && (
					<div className="flex items-center gap-1 mt-1 text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wide">
						<AlertCircle className="w-3 h-3" />
						Mandatory Action
					</div>
				)}
			</div>
		</div>
	);
}
