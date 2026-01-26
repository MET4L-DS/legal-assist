"use client";

import {
	Message,
	StructuredCitation,
	SentenceCitations,
} from "@/lib/types/rag";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	BookOpen,
	Clock,
	Copy,
	ShieldCheck,
	ShieldAlert,
	ShieldQuestion,
} from "lucide-react";
import { ClarificationPrompt } from "./ClarificationPrompt";
import { Timeline } from "./Timeline";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessageProps {
	message: Message;
	onOptionSelect?: (option: string, type: string) => void;
	onCitationClick?: (citation: StructuredCitation) => void;
}

const getTierInfo = (tier: string) => {
	switch (tier) {
		case "tier1":
			return {
				label: "Tier 1: Procedural (Urgent)",
				variant: "destructive" as const,
			};
		case "tier2_evidence":
			return {
				label: "Tier 2: Evidence Manual",
				variant: "secondary" as const,
			};
		case "tier2_compensation":
			return {
				label: "Tier 2: Compensation",
				variant: "secondary" as const,
			};
		case "tier3":
			return {
				label: "Tier 3: General Procedure",
				variant: "outline" as const,
			};
		default:
			return {
				label: "Standard Legal Info",
				variant: "outline" as const,
			};
	}
};

const getConfidenceInfo = (confidence?: string) => {
	switch (confidence) {
		case "high":
			return {
				label: "High Confidence",
				icon: ShieldCheck,
				color: "text-green-600 dark:text-green-400",
				desc: "Verified against explicit SOPs/BNS sections.",
			};
		case "medium":
			return {
				label: "Medium Confidence",
				icon: ShieldAlert,
				color: "text-amber-600 dark:text-amber-400",
				desc: "Based on general legal principles; specifics may vary.",
			};
		case "low":
			return {
				label: "Low Confidence",
				icon: ShieldQuestion,
				color: "text-red-600 dark:text-red-400",
				desc: "Requires further verification. Consult a lawyer.",
			};
		default:
			return null;
	}
};

export function ChatMessage({
	message,
	onOptionSelect,
	onCitationClick,
}: ChatMessageProps) {
	const isUser = message.role === "user";
	const tierInfo = message.tier ? getTierInfo(message.tier) : null;
	const confidenceInfo = !isUser
		? getConfidenceInfo(message.confidence)
		: null;
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(message.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn(
				"flex w-full items-start gap-4 p-4",
				isUser ? "flex-row-reverse" : "flex-row",
			)}
		>
			<Avatar>
				<AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
				<AvatarImage src={isUser ? undefined : "/bot-avatar.png"} />
			</Avatar>

			<div
				className={cn(
					"flex flex-col gap-2 max-w-[80%]",
					isUser ? "items-end" : "items-start",
				)}
			>
				<div
					className={cn(
						"rounded-lg px-4 py-3 text-sm shadow-sm relative group",
						isUser
							? "bg-primary text-primary-foreground"
							: "bg-white dark:bg-zinc-900 border",
					)}
				>
					{message.system_notice && (
						<Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50">
							<AlertTitle className="text-yellow-800 dark:text-yellow-500 font-semibold text-xs flex items-center gap-2">
								<ShieldAlert className="h-4 w-4" />
								{message.system_notice.level === "warning"
									? "Notice"
									: "Info"}
							</AlertTitle>
							<AlertDescription className="text-yellow-700 dark:text-yellow-400/90 text-xs mt-1">
								{message.system_notice.message}
							</AlertDescription>
						</Alert>
					)}

					{!isUser && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={handleCopy}
						>
							{copied ? (
								<span className="text-[10px]">Copied</span>
							) : (
								<Copy className="h-3 w-3" />
							)}
						</Button>
					)}

					{!isUser && (
						<div className="flex items-center gap-3 mb-2 flex-wrap">
							{tierInfo && (
								<Badge variant={tierInfo.variant}>
									{tierInfo.label}
								</Badge>
							)}

							{confidenceInfo && (
								<TooltipProvider>
									<Tooltip delayDuration={300}>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider cursor-help opacity-90 hover:opacity-100 transition-opacity",
													confidenceInfo.color,
												)}
											>
												<confidenceInfo.icon className="w-3 h-3" />
												<span>
													{confidenceInfo.label}
												</span>
											</div>
										</TooltipTrigger>
										<TooltipContent
											side="right"
											className="max-w-[200px] text-xs"
										>
											<p>{confidenceInfo.desc}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					)}

					{!isUser &&
						message.timeline &&
						message.timeline.length > 0 && (
							<Timeline
								items={message.timeline}
								confidence={message.confidence}
							/>
						)}

					<div
						className={cn(
							"text-sm leading-relaxed break-words",
							!isUser &&
								"prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0",
						)}
					>
						{isUser ? (
							<div className="whitespace-pre-wrap">
								{message.content}
							</div>
						) : message.sentence_citations ? (
							<div>
								{message.sentence_citations.sentences.map(
									(sent) => {
										const citationKeys =
											message.sentence_citations!.mapping[
												sent.sid
											] || [];
										const hasCitations =
											citationKeys.length > 0;

										return (
											<span
												key={sent.sid}
												className={cn(
													"mr-1 inline transition-colors duration-200 rounded px-0.5 -mx-0.5 box-decoration-clone",
													hasCitations
														? "cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-blue-600 dark:hover:text-blue-400"
														: "",
												)}
												onClick={() => {
													if (
														hasCitations &&
														onCitationClick &&
														message.citations
													) {
														const [type, id] =
															citationKeys[0].split(
																":",
															);
														const citation =
															message.citations.find(
																(c) =>
																	c.source_type ===
																		type &&
																	c.source_id ===
																		id,
															);
														if (citation)
															onCitationClick(
																citation,
															);
													}
												}}
												title={
													hasCitations
														? "Click to view source"
														: undefined
												}
											>
												<ReactMarkdown
													components={{
														p: ({ children }) => (
															<span className="inline">
																{children}
															</span>
														),
													}}
												>
													{sent.text}
												</ReactMarkdown>
											</span>
										);
									},
								)}
							</div>
						) : (
							<ReactMarkdown>{message.content}</ReactMarkdown>
						)}
					</div>
				</div>

				{!isUser && message.clarification_needed && (
					<div className="w-full mt-2">
						<ClarificationPrompt
							data={message.clarification_needed}
							onSelect={(opt) =>
								onOptionSelect?.(
									opt,
									message.clarification_needed!.type,
								)
							}
						/>
					</div>
				)}

				{!isUser &&
					message.citations &&
					message.citations.length > 0 && (
						<Card className="w-full mt-2 bg-muted/30">
							<CardHeader className="py-2 px-4">
								<CardTitle className="text-xs flex items-center gap-2 text-muted-foreground">
									<BookOpen className="h-3 w-3" />
									References & Citations
								</CardTitle>
							</CardHeader>
							<CardContent className="py-2 px-4 pb-3">
								<ul className="pl-4 space-y-2">
									{message.citations.map((citation, idx) => (
										<li
											key={idx}
											className="text-xs text-muted-foreground list-none"
										>
											<button
												onClick={() =>
													onCitationClick?.(citation)
												}
												className="inline-flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-700 w-full"
											>
												<BookOpen className="h-3 w-3 shrink-0 text-primary/70" />
												<span className="truncate">
													{citation.display}
												</span>
												<Badge
													variant="secondary"
													className="ml-auto text-[10px] h-5 px-1 font-normal bg-slate-100 hover:bg-white"
												>
													View Source
												</Badge>
											</button>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}
			</div>
		</div>
	);
}
