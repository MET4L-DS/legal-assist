"use client";

import { useState, useRef, useEffect } from "react";
import { Message, RAGContext } from "@/lib/types/rag";
import { queryRAG } from "@/lib/api/rag";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function ChatContainer() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);
	const [context, setContext] = useState<RAGContext>({
		last_case_type: null,
		last_stage: null,
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async (content: string, tempContext?: RAGContext) => {
		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content,
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setLoading(true);

		try {
			const activeContext = tempContext || context;

			const response = await queryRAG({
				query: content,
				context: activeContext,
			});

			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: response.answer,
				tier: response.tier,
				citations: response.citations,
				timeline: response.timeline,
				clarification_needed: response.clarification_needed,
				confidence: response.confidence,
				timestamp: Date.now(),
			};

			setMessages((prev) => [...prev, aiMessage]);

			// Update context mainly if successful
			if (response.case_type || response.stage) {
				setContext({
					last_case_type:
						response.case_type ||
						activeContext.last_case_type ||
						null,
					last_stage:
						response.stage || activeContext.last_stage || null,
				});
			}
		} catch (error) {
			console.error("Failed to query RAG:", error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content:
					"I apologize, but I encountered an error while processing your request. Please check if the backend is running.",
				timestamp: Date.now(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const handleOptionSelect = (option: string, type: string) => {
		// Create temporary context update for this request
		const nextContext = { ...context };

		// Map known types to context fields
		// Note: Backend should return 'case_type' or 'stage' as type, or we might need to infer
		if (type === "case_type" || type === "last_case_type") {
			nextContext.last_case_type = option;
		} else if (type === "stage" || type === "last_stage") {
			nextContext.last_stage = option;
		}

		// Also update state for future
		setContext(nextContext);

		// Send the option as the message
		handleSend(option, nextContext);
	};

	const lastMessage = messages[messages.length - 1];
	const isClarificationPending =
		!loading &&
		!!lastMessage?.clarification_needed &&
		lastMessage.role === "assistant";

	return (
		<Card className="flex flex-col h-[85vh] min-h-[500px] w-full max-w-4xl mx-auto shadow-xl">
			<div className="p-4 border-b bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div>
					<h2 className="text-lg font-semibold flex items-center gap-2">
						Legal Assistant
						<span className="text-[10px] font-normal bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
							Verified from Government SOPs
						</span>
					</h2>
					<p className="text-xs text-muted-foreground mt-1">
						AI-powered legal guidance (Indian Law) • Last updated:
						2023 laws
					</p>
				</div>
			</div>

			<ScrollArea className="flex-1 p-4">
				<div className="flex flex-col gap-4">
					{messages.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20 text-center px-4">
							<p>Welcome to Legal Assist.</p>
							<p className="text-sm mt-2">
								Ask me about procedures, evidence, compensation,
								or legal penalties.
							</p>
						</div>
					)}

					{messages.map((msg) => (
						<ChatMessage
							key={msg.id}
							message={msg}
							onOptionSelect={handleOptionSelect}
						/>
					))}

					{loading && (
						<div className="flex items-center gap-2 p-4 text-muted-foreground text-sm">
							<div className="animate-pulse">Thinking...</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			<div className="p-4 border-t bg-background flex flex-col gap-2">
				<ChatInput
					onSend={(text) => handleSend(text)}
					disabled={loading || isClarificationPending}
					placeholder={
						isClarificationPending
							? "Please select an option above to continue..."
							: undefined
					}
				/>
				<p className="text-[10px] text-center text-muted-foreground">
					Information provided is for guidance only and does not
					constitute legal advice. Consult a lawyer for specific
					cases.
				</p>
			</div>
		</Card>
	);
}
