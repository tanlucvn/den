import { isThisMonth, isThisWeek, isToday } from "date-fns";
import type { Tag } from "@/db/schema/tags";
import type { TaskWithTags } from "@/db/schema/tasks";

export function getTagSummary(
	tags: Tag[],
	tasks: TaskWithTags[],
	filter: string,
) {
	//* Filter tags by selected time range (all, today, week, month)
	const filteredTags = tags.filter((tag) => {
		const date = new Date(tag.createdAt);
		switch (filter) {
			case "today":
				return isToday(date);
			case "week":
				return isThisWeek(date);
			case "month":
				return isThisMonth(date);
			default:
				return true;
		}
	});

	//* Count how many times each tag is used across all tasks
	const tagCount: Record<string, number> = {};
	for (const task of tasks) {
		if (!task.tags) continue;
		for (const tag of task.tags) {
			tagCount[tag.id] = (tagCount[tag.id] || 0) + 1;
		}
	}

	//* Get tags with custom color set
	const withColor = filteredTags.filter((tag) => !!tag.color);

	//* Get tags that are not used in any tasks
	const unused = filteredTags.filter((tag) => !tagCount[tag.id]);

	//* Get the most used tag
	let mostUsed: Tag | undefined;
	let maxCount = 0;
	for (const tag of filteredTags) {
		const count = tagCount[tag.id] || 0;
		if (count > maxCount) {
			maxCount = count;
			mostUsed = tag;
		}
	}

	return {
		filteredTags,
		total: filteredTags.length,
		withColorCount: withColor.length,
		unusedCount: unused.length,
		mostUsed,
	};
}
