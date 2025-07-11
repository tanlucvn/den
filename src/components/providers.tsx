import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "./ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<SidebarProvider>
					{children}

					<Toaster position="bottom-center" closeButton />
					<Analytics />
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
