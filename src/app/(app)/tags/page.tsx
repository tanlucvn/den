"use client";

import TagManagerSection from "@/components/features/tags/tag-manager-section";
import { TagSummaryCard } from "@/components/features/tags/tag-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/tags/header-nav";
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TagsPage() {
	const { data: allTags = [], isLoading, isFetched } = useTags();
	const { data: allTasks = [] } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<TagManagerSection
					iconName="Tags"
					title="All Tags"
					description="Create, rename, and manage all your tags here."
					tags={allTags}
					isLoading={isLoading}
					isFetched={isFetched}
				/>

				<TagSummaryCard tasks={allTasks} tags={allTags} isLoading={isLoading} />
			</div>
		</AppLayout>
	);
}
