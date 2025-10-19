"use client";

import Header from "@/components/custom/dashboard/Header";
import SideBar from "@/components/custom/dashboard/SideBar";
import { ReactNode, useState } from "react";
import "../../styles/main.scss";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarActive, setSidebarActive] = useState(false);

	const toggleSidebar = () => setSidebarActive((prev) => !prev);

	return (
		<div className="flex h-screen w-screen max-w-screen overflow-hidden bg-gray-100 text-gray-900">
			{/* Sidebar */}
			<SideBar active={sidebarActive} toggleActive={toggleSidebar} />

			{/* Main Content Area */}
			<div className="main-container flex flex-col overflow-auto">
				{/* Topbar / Header */}
				<Header />

				{/* Page Content */}
				<main className="flex-1 p-6 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
