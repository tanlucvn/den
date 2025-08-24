"use client";

import AllTags from "@/components/features/tags/all-tags";
import { TagSummaryCard } from "@/components/features/tags/tag-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/tags/header-nav";
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TagsPage() {
	const { data: allTags = [], isLoading } = useTags();
	const { data: allTasks = [] } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<AllTags
				title="All Tags"
				description="Create, rename, and manage all your tags here."
				tags={allTags}
				isLoading={isLoading}
			/>

			<TagSummaryCard tasks={allTasks} tags={allTags} isLoading={isLoading} />
		</AppLayout>
	);
}
