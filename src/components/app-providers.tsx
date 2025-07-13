"use client";

import type React from "react";
import AppLayout from "@/components/layouts/app-layout";
import { ModalInitializer } from "./layouts/initializer/modal-initializer";

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppLayout>
			{children}
			<ModalInitializer />
		</AppLayout>
	);
}
