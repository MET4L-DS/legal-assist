import { ChatContainer } from "@/components/chat";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
			<div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
				<ChatContainer />
			</div>
		</main>
	);
}
