"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import AppLayout from "@/components/layouts/app-layout";
import { ModalInitializer } from "./layouts/initializer/modal-initializer";

const queryClient = new QueryClient();

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<AppLayout>
				{children}
				<ModalInitializer />
			</AppLayout>

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
