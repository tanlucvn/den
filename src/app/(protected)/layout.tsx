import type React from "react";
import AppLayout from "@/components/layouts/app-layout";
import { ModalInitializer } from "@/components/layouts/initializer/modal-initializer";
import SupabaseProvider from "@/lib/supabase/supabase-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SupabaseProvider>
			<AppLayout>
				{children}
				<ModalInitializer />
			</AppLayout>
		</SupabaseProvider>
	);
}
