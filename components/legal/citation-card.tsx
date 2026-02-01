import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";
import { Source } from "@/lib/types";

interface CitationCardProps {
	source: Source;
}

export function CitationCard({ source }: CitationCardProps) {
	return (
		<Card className="h-full hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/80">
			<CardHeader className="pb-2 space-y-1">
				<div className="flex items-center justify-between">
					<Badge
						variant="outline"
						className="font-mono text-xs text-muted-foreground"
					>
						{source.law}
					</Badge>
					<BookOpen className="h-4 w-4 text-primary/40" />
				</div>
				<CardTitle className="text-sm font-semibold font-playfair leading-tight text-primary">
					{source.citation}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-32 w-full rounded-md border bg-muted/30 p-3">
					<p className="text-xs text-muted-foreground leading-relaxed font-mono">
						&quot;{source.text}&quot;
					</p>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
