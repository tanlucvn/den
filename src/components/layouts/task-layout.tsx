"use client";

import { AppQuickActions } from "@/components/common/app-quick-actions";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TaskLayoutProps {
	children: React.ReactNode;
}

export default function TaskLayout({ children }: TaskLayoutProps) {
	return (
		<div className="relative flex min-h-screen w-full max-w-prose flex-col gap-6 bg-background">
			<header className="px-4">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />

						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>

						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>Home</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</div>
			</header>

			<div className="sticky top-2 z-10 w-full px-4">
				<AppQuickActions />
			</div>

			<main className="flex-1 px-4">{children}</main>
		</div>
	);
}
