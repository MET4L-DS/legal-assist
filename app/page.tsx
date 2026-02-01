"use client";

import { useState, useRef, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatResponse } from "@/components/chat/chat-response";
import { CitationSidebar } from "@/components/chat/citation-sidebar";
import { fetchLegalAnswer } from "@/lib/api";
import { LegalResponse, Source } from "@/lib/types";
import { Loader2, Scale, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Message {
	id: string;
	role: "user" | "assistant";
	content?: string;
	data?: LegalResponse;
	timestamp: Date;
}

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeSources, setActiveSources] = useState<Source[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleSearch = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!query.trim() || isLoading) return;

		const userMsg: Message = {
			id: Date.now().toString(),
			role: "user",
			content: query,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setIsLoading(true);
		const currentQuery = query;
		setQuery("");

		try {
			const response = await fetchLegalAnswer(currentQuery);
			const aiMsg: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				data: response,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, aiMsg]);
		} catch (error) {
			// Ideally add an error message bubble
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const openCitations = (sources: Source[]) => {
		setActiveSources(sources);
		setSidebarOpen(true);
	};

	return (
		<ChatLayout>
			<div className="flex-1 flex flex-col h-[calc(100vh-8rem)] relative">
				{/* Chat Area */}
				<ScrollArea className="flex-1 pr-4">
					{messages.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4 opacity-75">
							<div className="bg-primary/10 p-4 rounded-full mb-4">
								<Scale className="h-10 w-10 text-primary" />
							</div>
							<h1 className="text-2xl font-playfair font-semibold">
								How can legal assist help you today?
							</h1>
							<p className="text-muted-foreground max-w-md">
								I can guide you through legal procedures,
								explain your rights, and provide authoritative
								information based on Indian Law.
							</p>
						</div>
					) : (
						<div className="space-y-6 pb-4">
							{messages.map((msg) => (
								<MessageBubble key={msg.id} role={msg.role}>
									{msg.role === "user" ? (
										<p className="whitespace-pre-wrap leading-relaxed">
											{msg.content}
										</p>
									) : (
										msg.data && (
											<ChatResponse
												data={msg.data}
												onOpenCitation={() =>
													openCitations(
														msg.data!.sources,
													)
												}
											/>
										)
									)}
								</MessageBubble>
							))}

							{isLoading && (
								<MessageBubble role="assistant">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span className="text-sm font-medium animate-pulse">
											Analyzing legal precedents...
										</span>
									</div>
								</MessageBubble>
							)}
							<div ref={scrollRef} />
						</div>
					)}
				</ScrollArea>

				{/* Input Area (Sticky Bottom) */}
				<div className="mt-4 pt-4 border-t bg-background">
					<form
						onSubmit={handleSearch}
						className="relative flex items-center gap-2 p-1 border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-card"
					>
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Ask a legal question..."
							className="flex-1 border-none shadow-none focus-visible:ring-0 min-h-[48px]"
							autoFocus
						/>
						<Button
							type="submit"
							size="icon"
							disabled={isLoading || !query.trim()}
							className="rounded-lg h-9 w-9 mr-1"
						>
							<SendHorizontal className="h-4 w-4" />
						</Button>
					</form>
					<p className="text-[10px] text-center text-muted-foreground mt-2">
						AI can make mistakes. Please verify important
						information.
					</p>
				</div>
			</div>

			<CitationSidebar
				open={sidebarOpen}
				onOpenChange={setSidebarOpen}
				sources={activeSources}
			/>
		</ChatLayout>
	);
}
