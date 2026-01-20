"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
	const [input, setInput] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			onSend(input);
			setInput("");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full items-center gap-2 p-4 border-t bg-background"
		>
			<Input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Ask a legal question..."
				className="flex-1"
				disabled={disabled}
			/>
			<Button
				type="submit"
				size="icon"
				disabled={disabled || !input.trim()}
			>
				<Send className="h-4 w-4" />
				<span className="sr-only">Send</span>
			</Button>
		</form>
	);
}
