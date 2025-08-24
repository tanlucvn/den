"use client";

import { IconRenderer } from "@/components/icon-renderer";
import { AsideTrigger } from "@/components/layouts/app-aside";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useViewStore, type ViewType } from "@/store/use-view-store";
import { HeaderFilter } from "./header-filter";

export default function HeaderOptions() {
	const { viewType, setViewType } = useViewStore();

	const handleViewChange = (type: ViewType) => {
		setViewType(type);
	};

	return (
		<div className="flex h-10 w-full items-center justify-between gap-2 border-b px-2 py-1">
			<div className="flex items-center gap-2">
				<HeaderFilter />

				<Separator
					orientation="vertical"
					className="data-[orientation=vertical]:h-4"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="relative font-normal">
							<IconRenderer
								name="SlidersHorizontal"
								className="text-muted-foreground"
							/>
							Display
							{viewType === "grid" && (
								<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-500" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="flex w-60 gap-2 p-2" align="center">
						<DropdownMenuItem
							onClick={() => handleViewChange("list")}
							className={cn(
								"flex w-full flex-col gap-1 border border-accent text-xs",
								viewType === "list" ? "bg-accent" : "",
							)}
						>
							<IconRenderer
								name="LayoutList"
								className="text-muted-foreground"
							/>
							List
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleViewChange("grid")}
							className={cn(
								"flex w-full flex-col gap-1 border border-accent text-xs",
								viewType === "grid" ? "bg-accent" : "",
							)}
						>
							<IconRenderer
								name="LayoutGrid"
								className="text-muted-foreground"
							/>
							Board
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<AsideTrigger />
		</div>
	);
}
