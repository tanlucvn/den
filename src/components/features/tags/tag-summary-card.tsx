"use client";

import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { StatItem } from "@/components/shared/stat-item";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tag } from "@/db/schema/tags";
import type { Task } from "@/db/schema/tasks";
import { FILTER_LABELS } from "@/lib/constants";
import { getTagSummary } from "@/lib/helpers/get-tag-summary";
import { cn } from "@/lib/utils";

interface TagSummaryCardProps {
	tags: Tag[];
	tasks: Task[];
	isLoading: boolean;
	className?: string;
}

export function TagSummaryCard({
	tags,
	tasks,
	isLoading,
	className,
}: TagSummaryCardProps) {
	const [filter, setFilter] = useState("all");
	const [isCollapsed, setIsCollapsed] = useState(false);

	if (isLoading) return <TagSummaryCardSkeleton className={className} />;

	const summary = getTagSummary(tags, tasks, filter);

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name="Tag" className="text-muted-foreground" />
					<span>Tag Summary</span>
				</CardTitle>
				<CardDescription className="text-sm">
					Overview of your tags.
				</CardDescription>
				<CardAction className="flex justify-center gap-2">
					{!isCollapsed && (
						<Tabs
							value={filter}
							onValueChange={setFilter}
							className="hidden md:block"
						>
							<TabsList className="h-7 rounded-full">
								{["all", "today", "week", "month"].map((v) => (
									<TabsTrigger
										key={v}
										value={v}
										className="rounded-full px-3 text-xs capitalize"
									>
										{FILTER_LABELS[v] ?? v}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					)}

					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-muted-foreground"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<IconRenderer
							name={isCollapsed ? "ChevronsUpDown" : "ChevronsDownUp"}
						/>
					</Button>
				</CardAction>
			</CardHeader>

			{/* Mobile Tabs */}
			{!isCollapsed && (
				<Tabs
					value={filter}
					onValueChange={setFilter}
					className="mx-auto md:hidden"
				>
					<TabsList className="h-7 rounded-full">
						{["all", "today", "week", "month"].map((v) => (
							<TabsTrigger
								key={v}
								value={v}
								className="rounded-full px-3 text-xs capitalize"
							>
								{FILTER_LABELS[v] ?? v}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			)}

			{!isCollapsed && (
				<CardContent
					className={cn(
						"flex flex-col items-center justify-center gap-4",
						summary.total === 0 && "px-0",
					)}
				>
					{summary.total === 0 ? (
						<EmptyState
							icon="Tags"
							title="No tags found"
							description="Try switching filters or create a tag."
							className="size-full"
							contentClassName="border-none h-40"
						/>
					) : (
						<>
							<div className="text-center">
								<p className="text-muted-foreground text-sm">Total Tags</p>
								<NumberFlow
									value={summary.total}
									className="font-bold text-4xl text-foreground leading-tight"
								/>
							</div>

							<div className="grid grid-cols-3 gap-8 text-center">
								<StatItem
									label="Most Used"
									value={summary.mostUsed?.title ?? "-"}
									icon="Flame"
									iconClassName="text-orange-500"
									description={
										summary.mostUsed
											? `"${summary.mostUsed.title}" is the most used tag`
											: "No tags used"
									}
								/>

								<StatItem
									label="Colorful Tags"
									value={summary.withColorCount}
									icon="Palette"
									iconClassName="text-pink-500"
									description="Tags with a color assigned"
								/>

								<StatItem
									label="Unused"
									value={summary.unusedCount}
									icon="EyeOff"
									iconClassName="text-muted-foreground"
									description="Tags not used in any task"
								/>
							</div>
						</>
					)}
				</CardContent>
			)}
		</Card>
	);
}

export function TagSummaryCardSkeleton({ className }: { className?: string }) {
	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<Skeleton className="size-4 rounded-full" />
					<Skeleton className="h-6 w-20" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-6 w-44" />
				</CardDescription>
				<CardAction className="flex items-center justify-center gap-2">
					<Skeleton className="size-7 rounded-full" />
				</CardAction>
			</CardHeader>

			<CardContent className="flex flex-col items-center justify-center gap-4">
				<Skeleton className="h-10 w-24" />
				<div className="grid grid-cols-3 gap-8 text-center">
					<Skeleton className="h-16 w-12" />
					<Skeleton className="h-16 w-12" />
					<Skeleton className="h-16 w-12" />
				</div>
			</CardContent>
		</Card>
	);
}
