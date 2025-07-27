import ClientProviders from "@/components/client-providers";
import { AppSidebar } from "@/components/common/app-sidebar";
import AppLayout from "@/components/layouts/app-layout";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return (
		<AppLayout>
			<ClientProviders>
				<SidebarProvider
					style={
						{
							"--sidebar-width": "19rem",
						} as React.CSSProperties
					}
				>
					<AppSidebar />

					<SidebarInset>
						<div className="relative mx-auto min-h-screen w-full max-w-3xl">
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</ClientProviders>
		</AppLayout>
	);
}
