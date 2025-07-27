import { ThemeProvider } from "@/components/theme";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<TooltipProvider>{children}</TooltipProvider>
		</ThemeProvider>
	);
}
