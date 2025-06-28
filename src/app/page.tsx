import { AppQuickActions } from "@/components/common/app-quick-actions";
import AppHeader from "@/components/common/header";

export default async function Home() {
	return (
		<main className="flex flex-col gap-4">
			<AppHeader />
			<div>
				<AppQuickActions />
			</div>
		</main>
	);
}
