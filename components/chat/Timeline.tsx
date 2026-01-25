import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface TimelineItem {
	time?: string;
	description: string;
}

interface TimelineProps {
	items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
	return (
		<div className="bg-red-50/50 dark:bg-red-950/10 rounded-lg p-4 mb-4 border border-red-100 dark:border-red-900/50">
			<div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
				<Clock className="w-4 h-4" />
				<span className="text-xs font-semibold uppercase tracking-wider">
					Critical Timelines
				</span>
			</div>
			<div className="relative border-l-2 border-red-200 dark:border-red-900 pl-4 ml-2 space-y-4">
				{items.map((item, idx) => (
					<div key={idx} className="relative">
						<div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-400 border-2 border-white dark:border-zinc-950"></div>
						<div className="flex flex-col gap-0.5">
							{item.time && (
								<span className="text-xs font-extrabold text-red-700 dark:text-red-400 uppercase">
									{item.time}
								</span>
							)}
							<p className="text-xs text-muted-foreground leading-relaxed">
								{item.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
