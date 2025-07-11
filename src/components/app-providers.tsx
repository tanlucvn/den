import type React from "react";
import AppLayout from "@/components/layouts/app-layout";
import SupabaseProvider from "@/lib/supabase/supabase-provider";
import { ModalInitializer } from "./layouts/initializer/modal-initializer";

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SupabaseProvider>
			<AppLayout>
				{children}
				<ModalInitializer />
			</AppLayout>
		</SupabaseProvider>
	);
}
