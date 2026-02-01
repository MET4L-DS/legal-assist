"use client";

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface ChatLayoutProps {
	children: ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="flex items-center gap-2 text-sm font-medium">
						<span className="text-muted-foreground">
							Legal Assist
						</span>
						<span className="text-muted-foreground">/</span>
						<span>New Conversation</span>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 max-w-5xl mx-auto w-full">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
