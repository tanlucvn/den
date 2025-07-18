import AppProviders from "@/components/app-providers";
import { AppQuickActions } from "@/components/common/app-quick-actions";
import AppHeader from "@/components/common/header";

interface LayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return (
		<AppProviders>
			<div className="relative flex min-h-screen flex-col gap-6 bg-background">
				<header className="px-4">
					<AppHeader />
				</header>

				<div className="sticky top-2 z-10 w-full px-4">
					<AppQuickActions />
				</div>

				<main className="flex-1 px-4">
					<div className="mx-auto w-full max-w-4xl">{children}</div>
				</main>
			</div>
		</AppProviders>
	);
}
