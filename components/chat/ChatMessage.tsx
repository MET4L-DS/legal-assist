"use client";

import { Message } from "@/lib/types/rag";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Clock, Copy } from "lucide-react";
import { ClarificationPrompt } from "./ClarificationPrompt";
import { Timeline } from "./Timeline";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Button } from "../ui/button";

interface ChatMessageProps {
	message: Message;
	onOptionSelect?: (option: string, type: string) => void;
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

export function ChatMessage({ message, onOptionSelect }: ChatMessageProps) {
	const isUser = message.role === "user";
	const tierInfo = message.tier ? getTierInfo(message.tier) : null;
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

					{tierInfo && !isUser && (
						<Badge variant={tierInfo.variant} className="mb-2">
							{tierInfo.label}
						</Badge>
					)}

					{!isUser &&
						message.timeline &&
						message.timeline.length > 0 && (
							<Timeline items={message.timeline} />
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
								<ul className="list-disc pl-4 space-y-1">
									{message.citations.map((citation, idx) => (
										<li
											key={idx}
											className="text-xs text-muted-foreground"
										>
											{citation}
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
