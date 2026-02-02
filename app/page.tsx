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
import { motion, AnimatePresence } from "motion/react";
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

	// Typing Animation State
	const [placeholderText, setPlaceholderText] = useState("");
	const [isTyping, setIsTyping] = useState(true);
	const [loopNum, setLoopNum] = useState(0);
	const [typingSpeed, setTypingSpeed] = useState(150);

	// Carousel State
	const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

	const placeholders = [
		"Ask a legal question...",
		"How do I file a Zero FIR?",
		"Rights during an arrest?",
		"Cyber fraud reporting steps...",
	];

	const carouselSuggestions = [
		"I've been a victim of online fraud",
		"How to register a Zero FIR?",
		"Rights during an arrest",
		"File a domestic violence complaint",
		"Procedure for divorce mutual consent",
		"Understanding bail conditions",
	];

	// Typing Effect Logic
	useEffect(() => {
		let ticker: NodeJS.Timeout;
		if (query) {
			setPlaceholderText("");
			return;
		}

		const handleTyping = () => {
			const i = loopNum % placeholders.length;
			const fullText = placeholders[i];

			setPlaceholderText(
				isTyping
					? fullText.substring(0, placeholderText.length + 1)
					: fullText.substring(0, placeholderText.length - 1),
			);

			setTypingSpeed(isTyping ? 100 : 50);

			if (!isTyping && placeholderText === "") {
				setIsTyping(true);
				setLoopNum(loopNum + 1);
				setTypingSpeed(500); // Pause before typing new word
			} else if (isTyping && placeholderText === fullText) {
				setIsTyping(false);
				setTypingSpeed(2000); // Pause before deleting
			}
		};

		ticker = setTimeout(handleTyping, typingSpeed);
		return () => clearTimeout(ticker);
	}, [placeholderText, isTyping, loopNum, typingSpeed, placeholders, query]);

	// Carousel Rotation Logic
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSuggestionIndex(
				(prev) => (prev + 1) % carouselSuggestions.length,
			);
		}, 4000); // Rotate every 4 seconds
		return () => clearInterval(interval);
	}, [carouselSuggestions.length]);

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
						<div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-12 px-4 relative overflow-hidden">
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="space-y-6 max-w-2xl relative z-10"
							>
								<div className="bg-primary/5 p-6 rounded-full mb-6 inline-block ring-1 ring-primary/10 shadow-sm">
									<Scale className="h-14 w-14 text-primary/80" />
								</div>
								<h1 className="text-4xl md:text-5xl font-playfair font-semibold tracking-tight text-foreground/90 leading-tight">
									Legal Assist AI
								</h1>
								<p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
									Your personal counsel for Indian Law. <br />
									Simplifying justice, one question at a time.
								</p>
							</motion.div>

							{/* Animated Text Carousel (No more cards) */}
							<div className="h-16 w-full max-w-md mx-auto relative overflow-hidden flex items-center justify-center">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentSuggestionIndex}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{
											duration: 0.5,
											ease: "easeInOut",
										}}
										className="absolute w-full text-center"
									>
										<p className="text-sm font-medium text-primary/70 bg-primary/5 px-4 py-2 rounded-full inline-block border border-primary/10 backdrop-blur-sm">
											<span className="opacity-60 mr-2">
												Try asking:
											</span>
											"
											{
												carouselSuggestions[
													currentSuggestionIndex
												]
											}
											"
										</p>
									</motion.div>
								</AnimatePresence>
							</div>
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
				<div className="mt-4 pt-4 border-t bg-background relative z-20">
					<form
						onSubmit={handleSearch}
						className="relative flex items-center gap-2 p-1 border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-card"
					>
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={
								query
									? ""
									: placeholderText + (isTyping ? "|" : "")
							}
							className="flex-1 border-none shadow-none focus-visible:ring-0 min-h-[48px] placeholder:text-muted-foreground/50 transition-all"
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
