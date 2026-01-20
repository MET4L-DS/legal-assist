import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RAGResponse } from "@/lib/types/rag";

interface ClarificationPromptProps {
	data: NonNullable<RAGResponse["clarification_needed"]>;
	onSelect: (option: string) => void;
}

export function ClarificationPrompt({
	data,
	onSelect,
}: ClarificationPromptProps) {
	return (
		<Card className="w-full border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
					{data.reason}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-2 pt-2">
				{data.options.map((option) => (
					<Button
						key={option}
						variant="outline"
						size="sm"
						onClick={() => onSelect(option)}
						className="bg-white hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900"
					>
						{option}
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
