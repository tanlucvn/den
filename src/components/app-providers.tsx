"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import AppLayout from "@/components/layouts/app-layout";

const queryClient = new QueryClient();

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<AppLayout>{children}</AppLayout>

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
