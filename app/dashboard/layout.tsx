"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { ReactNode } from "react";
import "../../styles/main.scss";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<ProtectedRoute>
			<div className="h-screen flex overflow-hidden bg-background">
				<SidebarProvider
					style={
						{
							"--sidebar-width": "280px",
							"--header-height": "60px",
						} as React.CSSProperties
					}
					className="flex h-full w-full"
				>
					{/* Sidebar - Fixed position, independent scrolling */}
					<AppSidebar variant="sidebar" className="h-full" />
					
					{/* Main Content Area - Takes remaining space */}
					<SidebarInset className="flex-1 flex flex-col h-full overflow-hidden">
						{/* Header - Fixed at top */}
						<SiteHeader />
						
						{/* Main Body - Scrollable content area */}
						<main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
							<div className="h-full">
								{children}
							</div>
						</main>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ProtectedRoute>
	);
}
