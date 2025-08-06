import { Analytics } from "@vercel/analytics/next";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ViewTransitions>
			<ThemeProvider>
				<TooltipProvider delayDuration={500}>
					{children}

					<Toaster />
					<Analytics />
				</TooltipProvider>
			</ThemeProvider>
		</ViewTransitions>
	);
}
