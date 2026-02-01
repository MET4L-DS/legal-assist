"use client";

import { useState } from "react";
import { SearchSection } from "@/components/legal/search-section";
import { AnswerDisplay } from "@/components/legal/answer-display";
import { fetchLegalAnswer } from "@/lib/api";
import { LegalResponse } from "@/lib/types";
import { Loader2 } from "lucide-react";
// Toaster import removed

export default function Home() {
	const [data, setData] = useState<LegalResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = async (query: string) => {
		setIsLoading(true);
		setError(null);
		setHasSearched(true);
		setData(null);

		try {
			const result = await fetchLegalAnswer(query);
			setData(result);
		} catch (err) {
			console.error(err);
			setError("Failed to fetch legal answer. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
			<div className="container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
				{/* Search Section (moves to top when has results ideally, but for now just above) */}
				<div
					className={`transition-all duration-700 ease-in-out ${hasSearched ? "py-4" : "flex-1 flex flex-col justify-center"}`}
				>
					<SearchSection
						onSearch={handleSearch}
						isLoading={isLoading}
					/>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-500">
						<Loader2 className="h-8 w-8 animate-spin text-primary/50" />
						<p className="text-muted-foreground font-playfair text-lg animate-pulse">
							Consulting the archives...
						</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="max-w-xl mx-auto mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center">
						<p>{error}</p>
					</div>
				)}

				{/* Results */}
				{data && !isLoading && (
					<div className="mt-8 animate-in float-up">
						<AnswerDisplay data={data} />
					</div>
				)}

				{/* Footer / Disclaimer */}
				<footer className="mt-auto py-8 text-center text-xs text-muted-foreground/60 max-w-2xl mx-auto">
					<p>
						Disclaimer: The information provided by this system is
						for educational and informational purposes only and does
						not constitute legal advice. Always consult with a
						qualified legal professional for specific legal
						concerns.
					</p>
				</footer>
			</div>
		</main>
	);
}
