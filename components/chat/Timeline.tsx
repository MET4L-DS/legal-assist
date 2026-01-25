import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";
import { TimelineItem } from "@/lib/types/rag";

interface TimelineProps {
	items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
	if (!items || items.length === 0) return null;

	return (
		<div className="bg-red-50/50 dark:bg-red-950/10 rounded-lg p-4 mb-4 border border-red-100 dark:border-red-900/50">
			<div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
				<Clock className="w-4 h-4" />
				<span className="text-xs font-semibold uppercase tracking-wider">
					Critical Timelines
				</span>
			</div>
			<div className="relative border-l-2 border-red-200 dark:border-red-900 pl-4 ml-2 space-y-6">
				{items.map((item, idx) => (
					<div key={idx} className="relative">
						<div
							className={cn(
								"absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950",
								item.mandatory
									? "bg-red-600 dark:bg-red-500"
									: "bg-red-300 dark:bg-red-800",
							)}
						/>
						<div className="flex flex-col gap-1">
							<div className="flex items-baseline justify-between gap-2">
								<span
									className={cn(
										"text-sm font-medium",
										item.mandatory
											? "text-red-800 dark:text-red-300"
											: "text-foreground",
									)}
								>
									{item.action}
								</span>
								{item.deadline && (
									<Badge
										variant="outline"
										className="text-[10px] whitespace-nowrap border-red-200 text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
									>
										<Clock className="w-3 h-3 mr-1 inline-block" />
										{item.deadline}
									</Badge>
								)}
							</div>

							<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
								<span className="font-semibold px-1.5 py-0.5 rounded bg-muted">
									{item.stage}
								</span>
								{item.legal_basis.length > 0 && (
									<span className="italic opacity-80">
										via {item.legal_basis.join(", ")}
									</span>
								)}
							</div>

							{item.mandatory && (
								<div className="flex items-center gap-1 mt-1 text-[10px] text-red-600 dark:text-red-400 font-medium uppercase tracking-wide">
									<AlertCircle className="w-3 h-3" />
									Mandatory Step
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

import { Badge } from "@/components/ui/badge";
