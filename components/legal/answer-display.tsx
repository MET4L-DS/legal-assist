import { LegalResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Gavel, Scale } from "lucide-react";
import { CitationCard } from "./citation-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface AnswerDisplayProps {
	data: LegalResponse;
}

export function AnswerDisplay({ data }: AnswerDisplayProps) {
	return (
		<div className="w-full max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
			{/* Main Answer Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					<Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<div className="flex items-center space-x-2 mb-2">
								<Scale className="h-5 w-5 text-primary" />
								<h2 className="text-lg font-semibold text-primary font-playfair">
									Legal Analysis
								</h2>
							</div>
							<CardTitle className="text-2xl leading-relaxed text-foreground font-medium">
								{data.answer}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2 mt-2">
								{data.metadata?.category && (
									<Badge
										variant="secondary"
										className="uppercase tracking-wider text-[10px]"
									>
										{data.metadata.category}
									</Badge>
								)}
								{data.metadata?.confidence && (
									<Badge
										variant={
											data.metadata.confidence > 0.8
												? "default"
												: "outline"
										}
										className="uppercase tracking-wider text-[10px]"
									>
										Confidence:{" "}
										{Math.round(
											data.metadata.confidence * 100,
										)}
										%
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Legal Basis */}
					<div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
						<h3 className="flex items-center font-semibold text-primary mb-2 font-playfair">
							<Gavel className="h-4 w-4 mr-2" />
							Legal Basis
						</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{data.legal_basis}
						</p>
					</div>
				</div>

				{/* Sidebar / Important Notes */}
				<div className="space-y-6">
					{data.important_notes &&
						data.important_notes.length > 0 && (
							<Card className="border-l-4 border-l-destructive/60 bg-destructive/5 shadow-none">
								<CardHeader className="pb-2">
									<div className="flex items-center space-x-2 text-destructive">
										<AlertCircle className="h-5 w-5" />
										<CardTitle className="text-base">
											Important Notes
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									{data.important_notes.map((note, idx) => (
										<div
											key={idx}
											className="text-sm text-foreground/80 flex items-start gap-2"
										>
											<span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
											<span className="leading-snug">
												{note}
											</span>
										</div>
									))}
								</CardContent>
							</Card>
						)}
				</div>
			</div>

			<Separator />

			{/* Procedural Steps */}
			{data.procedure_steps && data.procedure_steps.length > 0 && (
				<section className="space-y-4">
					<h3 className="text-xl font-playfair font-semibold text-foreground px-1">
						Procedural Steps
					</h3>
					<div className="relative border-l border-muted ml-3 space-y-8 py-2">
						{data.procedure_steps.map((step, idx) => (
							<div key={idx} className="relative pl-8 group">
								{/* Timeline Dot */}
								<div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-muted-foreground/30 ring-4 ring-background group-hover:bg-primary transition-colors" />

								<div className="flex items-start gap-3">
									<span className="text-xs font-mono text-muted-foreground pt-0.5">
										Step {idx + 1}
									</span>
								</div>
								<p className="text-foreground mt-1 leading-relaxed">
									{step}
								</p>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Sources Grid */}
			<section className="space-y-4">
				<h3 className="text-xl font-playfair font-semibold text-foreground px-1">
					Citations & Authorities
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.sources.map((source, idx) => (
						<CitationCard key={idx} source={source} />
					))}
				</div>
			</section>
		</div>
	);
}
