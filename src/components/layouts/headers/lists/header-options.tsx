"use client";

import { AsideTrigger } from "@/components/layouts/app-aside";
import { HeaderFilter } from "./header-filter";

export default function HeaderOptions() {
	return (
		<div className="flex h-10 w-full items-center justify-between gap-2 border-b px-2 py-1">
			<HeaderFilter />
			<AsideTrigger />
		</div>
	);
}
