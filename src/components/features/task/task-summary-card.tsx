"use client";

import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { Pie, PieChart } from "recharts";
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
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from "@/db/schema/tasks";
import { FILTER_LABELS } from "@/lib/constants";
import { getTaskSummary } from "@/lib/helpers/get-task-summary";
import { cn } from "@/lib/utils";

interface TaskSummaryCardProps {
	tasks: Task[];
	isLoading?: boolean;
	className?: string;
}

export function TaskSummaryCard({
	tasks,
	isLoading,
	className,
}: TaskSummaryCardProps) {
	const [filter, setFilter] = useState("all");
	const [isCollapsed, setIsCollapsed] = useState(false);

	const summary = getTaskSummary(tasks, filter);

	if (isLoading) return <TaskSummaryCardSkeleton />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name="ChartNoAxesGantt" className="text-primary/60" />
					<span>Task Summary</span>
				</CardTitle>

				<CardDescription className="text-sm">
					Summary of your current task status.
				</CardDescription>

				<CardAction className="flex justify-center gap-2">
					{/* Tabs hidden on mobile and when collapsed */}
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

					{/* Collapse toggle */}
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

			{/* Mobile tabs  */}
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

			{/* Main Content */}
			{!isCollapsed && (
				<CardContent
					className={cn(
						"grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 md:gap-4",
						summary.total === 0 && "px-0",
					)}
				>
					{/* No tasks fallback */}
					{summary.total === 0 ? (
						<EmptyState
							icon="Inbox"
							title="No tasks found"
							description="Try switching filters or creating a new task."
							className="col-span-2"
							contentClassName="border-none h-40"
						/>
					) : (
						<>
							{/* Pie chart section */}
							<div className="relative flex flex-col items-center justify-center">
								<ChartContainer
									config={summary.chartConfig}
									className="aspect-square size-[180px]"
								>
									<PieChart className="z-[1]">
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent hideLabel />}
										/>
										<Pie
											data={summary.pieData}
											dataKey="tasks"
											nameKey="status"
											innerRadius={60}
											outerRadius={80}
											startAngle={90}
											endAngle={450}
											paddingAngle={4}
											cornerRadius={20}
										/>
									</PieChart>
								</ChartContainer>

								{/* Center icon */}
								<span className="absolute z-0">
									{getProgressIcon(summary.completed, summary.total)}
								</span>

								{/* Legend under chart */}
								<div className="flex gap-4">
									{summary.pieData.map((item) => (
										<LegendItem
											key={item.status}
											label={
												item.status.charAt(0).toUpperCase() +
												item.status.slice(1)
											}
											color={item.fill}
										/>
									))}
								</div>
							</div>

							{/* Stats section */}
							<div className="flex flex-col items-center justify-end gap-4">
								<div className="text-center">
									<p className="text-muted-foreground text-sm">Total Tasks</p>
									<NumberFlow
										value={summary.total}
										className="font-bold text-4xl text-foreground leading-tight"
									/>
									<p className="text-muted-foreground text-xs">
										{summary.rate}% completed
									</p>
								</div>

								<div className="grid grid-cols-3 gap-4 text-center">
									<StatItem
										label="Completed"
										value={summary.completed}
										icon="CheckCircle"
										iconClassName="text-emerald-500"
									/>
									<StatItem
										label="Pinned"
										value={summary.pinned}
										icon="Pin"
										iconClassName="text-amber-500"
									/>
									<StatItem
										label="Archived"
										value={summary.archived}
										icon="Archive"
									/>
								</div>
							</div>
						</>
					)}
				</CardContent>
			)}
		</Card>
	);
}

function LegendItem({ label, color }: { label: string; color: string }) {
	return (
		<div className="flex items-center gap-2 text-muted-foreground text-sm">
			<span
				className="inline-block size-3 rounded-full"
				style={{ backgroundColor: color }}
			/>
			{label}
		</div>
	);
}

// Skeleton

export function TaskSummaryCardSkeleton({ className }: { className?: string }) {
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
					<Skeleton className="hidden h-7 w-48 rounded-full md:block" />
					<Skeleton className="size-7 rounded-full" />
				</CardAction>
			</CardHeader>

			{/* Mobile tabs */}
			<Skeleton className="mx-auto h-7 w-48 rounded-full md:hidden" />

			<CardContent className="grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 md:gap-4">
				{/* Chart + Legend */}
				<div className="flex flex-col items-center justify-center gap-4">
					<Skeleton className="size-[180px] rounded-full" />
					<div className="flex gap-4">
						<Skeleton className="h-5 w-20 rounded-full" />
						<Skeleton className="h-5 w-20 rounded-full" />
					</div>
				</div>

				{/* Stats */}
				<div className="flex flex-col items-center gap-4">
					<Skeleton className="h-18 w-14" />

					<div className="grid grid-cols-3 gap-4">
						<Skeleton className="h-16 w-12" />
						<Skeleton className="h-16 w-12" />
						<Skeleton className="h-16 w-12" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Helpers

function getProgressIcon(completed: number, total: number) {
	if (total === 0) return null;

	if (completed === total) {
		return (
			<div className="flex flex-col items-center gap-1 text-foreground">
				<IconRenderer name="CheckCheck" className="size-8" />
				<p className="text-xs">All Done!</p>
			</div>
		);
	}

	if (completed >= total / 2) {
		return (
			<div className="flex flex-col items-center gap-1 text-foreground">
				<IconRenderer name="Flame" className="size-8" />
				<p className="text-xs">Great Job!</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-1 text-foreground">
			<IconRenderer name="Dumbbell" className="size-8" />
			<p className="text-xs">On the Way!</p>
		</div>
	);
}
