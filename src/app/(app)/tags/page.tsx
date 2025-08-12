"use client";

import { AppQuickActions } from "@/components/common/app-quick-actions";
import TagManagerSection from "@/components/features/tags/tag-manager-section";
import { TagSummaryCard } from "@/components/features/tags/tag-summary-card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TagsPage() {
	const { data: allTags = [], isLoading, isFetched } = useTags();
	const { data: allTasks = [] } = useTasks();

	return (
		<div className="flex flex-col px-4">
			<div className="flex h-16 items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<span className="text-sm">Tags</span>
			</div>

			<div className="sticky top-2 z-10 mb-6 w-full rounded-full bg-background">
				<AppQuickActions />
			</div>

			<div className="mb-4 flex size-full flex-col gap-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<TagSummaryCard tasks={allTasks} tags={allTags} isLoading={isLoading} />

				<TagManagerSection
					iconName="Tags"
					title="All Tags"
					description="Create, rename, and manage all your tags here."
					tags={allTags}
					isLoading={isLoading}
					isFetched={isFetched}
				/>
			</div>
		</div>
	);
}
