import { LegalResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	BookOpen,
	AlertCircle,
	Shield,
	Scale,
	ClipboardCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface ChatResponseProps {
	data: LegalResponse;
	onOpenCitation: () => void;
}

export function ChatResponse({ data, onOpenCitation }: ChatResponseProps) {
	const isVictimContext =
		data.metadata?.user_context === "victim_distress" ||
		!!data.safety_alert;
	const hasSources = data.sources && data.sources.length > 0;
	const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>(
		{},
	);

	// Streaming Animation State
	const [displayedText, setDisplayedText] = useState("");
	const fullText = data.answer || "";

	useEffect(() => {
		let currentIndex = 0;
		// Faster streaming: 5-8 chars per tick
		const interval = setInterval(() => {
			if (currentIndex < fullText.length) {
				// Add a random chunk of text for more natural "typing" look
				const chunk = fullText.slice(currentIndex, currentIndex + 3);
				setDisplayedText((prev) => prev + chunk);
				currentIndex += 3;
			} else {
				clearInterval(interval);
				setDisplayedText(fullText); // Ensure exact match at end
			}
		}, 10); // 10ms interval

		return () => clearInterval(interval);
	}, [fullText]);

	const toggleStep = (idx: number) => {
		setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="space-y-5 text-sm font-inter text-foreground/90"
		>
			{/* 1. Safety Alert Block (Subtle Red Design) */}
			{data.safety_alert && (
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className="relative pl-4 border-l-2 border-destructive/60 py-1"
				>
					<div className="flex items-start gap-2">
						<AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
						<div className="space-y-1">
							<p className="font-semibold text-destructive text-sm leading-none">
								Emergency Protocol Active
							</p>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{data.safety_alert}
							</p>
						</div>
					</div>
					<a
						href="tel:112"
						className="absolute top-1 right-0 text-xs font-bold text-destructive hover:underline"
					>
						Call 112 &rarr;
					</a>
				</motion.div>
			)}

			{/* 2. Action Plan (Clean Checklist) */}
			{data.immediate_action_plan &&
				data.immediate_action_plan.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="py-2"
					>
						<div className="flex items-center gap-2 mb-3 text-foreground/80">
							<ClipboardCheck className="h-4 w-4 text-amber-600" />
							<span className="font-semibold text-xs uppercase tracking-wide opacity-70">
								Immediate Steps
							</span>
						</div>
						<div className="grid gap-2">
							{data.immediate_action_plan.map((step, idx) => (
								<div
									key={idx}
									className={`group flex items-start gap-3 p-2 rounded-md border border-transparent hover:bg-muted/50 transition-all cursor-pointer ${checkedSteps[idx] ? "opacity-50" : ""}`}
									onClick={() => toggleStep(idx)}
								>
									<Checkbox
										checked={checkedSteps[idx] || false}
										className="mt-0.5 h-4 w-4 border-muted-foreground/40 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
									/>
									<span
										className={`text-sm ${checkedSteps[idx] ? "line-through text-muted-foreground" : "text-foreground"}`}
									>
										{step}
									</span>
								</div>
							))}
						</div>
					</motion.div>
				)}

			{/* 3. Main Answer Body (Streaming) */}
			<div className="space-y-2">
				<div className="flex items-center gap-2 text-muted-foreground mb-1">
					{isVictimContext ? (
						<Shield className="h-3.5 w-3.5" />
					) : (
						<Scale className="h-3.5 w-3.5" />
					)}
					<span className="text-xs font-medium uppercase tracking-wider opacity-70">
						{isVictimContext ? "Guidance" : "Analysis"}
					</span>
				</div>

				<article className="prose prose-sm max-w-none prose-slate prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-foreground">
					<ReactMarkdown>{displayedText}</ReactMarkdown>
				</article>
			</div>

			{/* 4. Procedural Steps (Numbered) */}
			{displayedText.length === fullText.length &&
				data.procedure_steps &&
				data.procedure_steps.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="pt-4 mt-2"
					>
						<div className="space-y-3">
							{data.procedure_steps.map((step, idx) => (
								<div
									key={idx}
									className="flex gap-3 text-sm group"
								>
									<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
										{idx + 1}
									</span>
									<p className="text-foreground/80 leading-relaxed">
										{step}
									</p>
								</div>
							))}
						</div>
					</motion.div>
				)}

			{/* 5. Sources (Minimal Chips) */}
			{displayedText.length === fullText.length && hasSources && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="pt-4 flex flex-wrap gap-2 items-center opacity-80 hover:opacity-100 transition-opacity"
				>
					<Badge
						variant="outline"
						className="cursor-pointer hover:bg-muted transition-colors font-normal text-xs px-2 py-0.5 gap-1.5 h-6 text-muted-foreground hover:text-foreground"
						onClick={onOpenCitation}
					>
						<BookOpen className="h-3 w-3" />
						<span>{data.sources.length} Sources</span>
					</Badge>

					{data.sources.slice(0, 3).map((source, idx) => (
						<span
							key={idx}
							className="text-[10px] text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors max-w-[150px] truncate"
							onClick={onOpenCitation}
						>
							{source.law}
						</span>
					))}
				</motion.div>
			)}
		</motion.div>
	);
}
