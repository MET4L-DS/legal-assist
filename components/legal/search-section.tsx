"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "@/components/ui/text-animate";

interface SearchSectionProps {
	onSearch: (query: string) => void;
	isLoading: boolean;
}

export function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			console.log("[UI/SearchSection] Query submitted:", query);
			onSearch(query);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center transition-all duration-500 ease-in-out data-[has-results=true]:min-h-[20vh]">
			<div className="space-y-4 max-w-2xl px-4">
				<h1 className="text-4xl md:text-5xl font-playfair font-bold tracking-tight text-primary">
					<TextAnimate animation="blurInUp" by="word">
						Legal Answer Engine
					</TextAnimate>
				</h1>
				<p className="text-muted-foreground text-lg md:text-xl font-inter max-w-lg mx-auto">
					AI-powered legal research assistant. precise, authoritative,
					and instant.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-xl px-4 relative"
			>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
					</div>
					<Input
						type="text"
						placeholder="Ask a legal question (e.g., 'What is the procedure for zero FIR?')"
						className="pl-10 h-14 text-lg shadow-sm border-muted-foreground/20 focus-visible:ring-primary focus-visible:border-primary rounded-xl bg-background/50 backdrop-blur-sm transition-all"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						disabled={isLoading}
					/>
					<div className="absolute inset-y-0 right-2 flex items-center">
						<Button
							type="submit"
							size="sm"
							disabled={isLoading || !query.trim()}
							className="rounded-lg px-4 font-medium"
						>
							{isLoading ? "Analyzing..." : "Search"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
