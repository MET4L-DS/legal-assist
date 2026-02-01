import { LegalResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Scale, ShieldCheck, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ActionPlan } from "./action-plan";

interface AnswerDisplayProps {
	data: LegalResponse;
	onOpenCitation: () => void;
}

export function AnswerDisplay({ data, onOpenCitation }: AnswerDisplayProps) {
	const isVictimContext =
		data.metadata?.user_context === "victim_distress" ||
		!!data.safety_alert;
	const hasSources = data.sources && data.sources.length > 0;

	return (
		<Card
			className={`border-none shadow-sm overflow-hidden ${isVictimContext ? "bg-indigo-50/50" : "bg-transparent"}`}
		>
			{/* 1. Integrated Safety Banner */}
			{data.safety_alert && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-2 rounded-r-md">
					<div className="flex gap-3">
						<div className="mt-0.5">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<div className="flex-1">
							<h3 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-1">
								Emergency Protocol
							</h3>
							<p className="text-sm text-red-800 font-medium leading-relaxed">
								{data.safety_alert}
							</p>
							<a
								href="tel:112"
								className="inline-block mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition"
							>
								Call 112
							</a>
						</div>
					</div>
				</div>
			)}

			<CardContent className="p-0 space-y-4">
				{/* 2. Integrated Action Plan (Compact) */}
				{data.immediate_action_plan &&
					data.immediate_action_plan.length > 0 && (
						<div className="my-2">
							<ActionPlan steps={data.immediate_action_plan} />
						</div>
					)}

				{/* 3. Main Answer Header & Body */}
				<div>
					<div className="flex items-center space-x-2 mb-2">
						{isVictimContext ? (
							<ShieldCheck className="h-5 w-5 text-indigo-600" />
						) : (
							<Scale className="h-5 w-5 text-primary" />
						)}
						<h2
							className={`text-base font-semibold font-playfair ${isVictimContext ? "text-indigo-700" : "text-primary"}`}
						>
							{isVictimContext
								? "Guidance & Advice"
								: "Legal Analysis"}
						</h2>
					</div>

					<article
						className={`prose max-w-none text-sm leading-relaxed ${isVictimContext ? "prose-indigo" : "prose-slate"} prose-headings:font-playfair prose-headings:font-semibold prose-p:leading-relaxed prose-li:marker:text-primary/50`}
					>
						<ReactMarkdown>{data.answer}</ReactMarkdown>
					</article>
				</div>

				{/* 4. Metadata Badges (Subtle) */}
				<div className="flex flex-wrap gap-2 pt-2">
					{data.metadata?.intent && (
						<Badge
							variant="secondary"
							className="uppercase tracking-wider text-[10px] h-5 px-1.5 text-muted-foreground/80 bg-muted/50"
						>
							{data.metadata.intent}
						</Badge>
					)}
					{data.metadata?.user_context && (
						<Badge
							variant="outline"
							className="uppercase tracking-wider text-[10px] h-5 px-1.5 text-muted-foreground/80 border-muted"
						>
							{data.metadata.user_context}
						</Badge>
					)}
				</div>

				{/* 5. Procedural Steps */}
				{data.procedure_steps && data.procedure_steps.length > 0 && (
					<div className="pt-2 mt-2 border-t border-border/40">
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
							Key Steps
						</h3>
						<div className="space-y-3 pl-2 border-l-2 border-primary/20">
							{data.procedure_steps.map((step, idx) => (
								<div key={idx} className="relative pl-4">
									<div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-background border-2 border-primary/40" />
									<p className="text-sm text-foreground/90">
										{step}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* 6. Source Chips (Integrated Footer) */}
				{hasSources && (
					<div className="pt-3 mt-1 border-t border-border/40 flex flex-wrap gap-2 items-center">
						<div
							className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium cursor-pointer hover:bg-primary/10 transition-colors"
							onClick={onOpenCitation}
						>
							<BookOpen className="h-3 w-3" />
							<span>{data.sources.length} Citations</span>
						</div>
						{data.sources.slice(0, 2).map((source, idx) => (
							<span
								key={idx}
								className="text-xs text-muted-foreground hover:text-foreground cursor-pointer border-b border-transparent hover:border-muted-foreground transition-all line-clamp-1 max-w-[150px]"
								onClick={onOpenCitation}
							>
								{source.law}
							</span>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
