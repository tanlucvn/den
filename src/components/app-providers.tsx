import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "./ui/sidebar";

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<ThemeProvider>
				<TooltipProvider>
					<SidebarProvider>
						{children}

						<Toaster position="bottom-center" />
						<Analytics />
					</SidebarProvider>
				</TooltipProvider>
			</ThemeProvider>
		</ClerkProvider>
	);
}
