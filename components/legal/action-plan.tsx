"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList } from "lucide-react";
import { useState } from "react";

interface ActionPlanProps {
	steps: string[];
}

export function ActionPlan({ steps }: ActionPlanProps) {
	const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
		{},
	);

	const toggleItem = (idx: number) => {
		setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
	};

	return (
		<div className="bg-amber-50/50 rounded-md border border-amber-200/50 overflow-hidden">
			<div className="bg-amber-100/30 px-4 py-2 flex items-center gap-2 border-b border-amber-200/30">
				<ClipboardList className="h-4 w-4 text-amber-700" />
				<span className="text-sm font-bold text-amber-800 uppercase tracking-wide">
					Immediate Action Plan
				</span>
			</div>
			<div className="p-2 space-y-1">
				{steps.map((step, idx) => (
					<div
						key={idx}
						className={`flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer ${checkedItems[idx] ? "opacity-50" : "hover:bg-amber-100/20"}`}
						onClick={() => toggleItem(idx)}
					>
						<Checkbox
							checked={checkedItems[idx] || false}
							onCheckedChange={() => toggleItem(idx)}
							className="mt-0.5 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white h-4 w-4"
						/>
						<label
							className={`text-sm text-foreground/90 leading-snug cursor-pointer ${checkedItems[idx] ? "line-through decoration-amber-500/50" : ""}`}
						>
							{step}
						</label>
					</div>
				))}
			</div>
		</div>
	);
}
