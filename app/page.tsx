import { ChatContainer } from "@/components/chat";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-950">
			<div className="w-full max-w-[1400px] items-center justify-between font-mono text-sm">
				<ChatContainer />
			</div>
		</main>
	);
}
