"use client";

import * as React from "react";
import {
	BookOpen,
	Bot,
	History,
	LifeBuoy,
	Scale,
	Settings2,
	Plus,
	SquareTerminal,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const recentChats = [
	{
		title: "Robbery Incident Report",
		date: "Today",
		active: true,
	},
	{
		title: "Understanding Zero FIR",
		date: "Yesterday",
		active: false,
	},
	{
		title: "Domestic Violence Help",
		date: "2 days ago",
		active: false,
	},
	{
		title: "Cyber Fraud Procedure",
		date: "Last Week",
		active: false,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			className="bg-background/95 backdrop-blur-sm"
			{...props}
		>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2 text-sidebar-foreground">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Bot className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold uppercase tracking-widest font-playfair">
							Legal Assist
						</span>
						<span className="truncate text-xs text-muted-foreground">
							AI Counsel
						</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<div className="px-4 py-2">
					<Button
						className="w-full justify-start gap-2"
						variant="outline"
					>
						<Plus className="h-4 w-4" />
						New Conversation
					</Button>
				</div>

				<SidebarGroup className="relative overflow-hidden group/history">
					<SidebarGroupLabel className="group-hover/history:opacity-20 transition-opacity">
						Recent History
					</SidebarGroupLabel>
					<SidebarGroupContent className="group-hover/history:blur-[2px] blur-[1px] transition-all opacity-40 select-none pointer-events-none">
						<SidebarMenu>
							{recentChats.map((chat) => (
								<SidebarMenuItem key={chat.title}>
									<SidebarMenuButton isActive={chat.active}>
										<History className="text-muted-foreground" />
										<span>{chat.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
					<div className="absolute inset-x-0 bottom-4 flex items-center justify-center p-4">
						<div className="bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
							Coming Soon
						</div>
					</div>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="p-4 text-xs text-center text-muted-foreground">
					&copy; 2026 Legal Assist AI
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
