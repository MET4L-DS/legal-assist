import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
	role: "user" | "assistant";
	children: React.ReactNode;
}

export function MessageBubble({ role, children }: MessageBubbleProps) {
	return (
		<div
			className={cn(
				"flex w-full gap-4 max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
				role === "user" ? "flex-row-reverse" : "flex-row",
			)}
		>
			{/* Avatar */}
			<div
				className={cn(
					"flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm mt-1",
					role === "user"
						? "bg-primary text-primary-foreground"
						: "bg-muted text-foreground",
				)}
			>
				{role === "user" ? (
					<User className="h-4 w-4" />
				) : (
					<Bot className="h-4 w-4" />
				)}
			</div>

			{/* Content */}
			<div
				className={cn(
					"flex-1 overflow-hidden rounded-lg p-1",
					role === "user"
						? "bg-primary text-primary-foreground px-4 py-3 shadow-md max-w-[80%]"
						: "bg-transparent max-w-full",
				)}
			>
				{children}
			</div>
		</div>
	);
}
