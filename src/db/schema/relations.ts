import { relations } from "drizzle-orm";
import { lists } from "./lists";
import { tags, taskTags } from "./tags";
import { tasks } from "./tasks";

export const tasksRelations = relations(tasks, ({ one, many }) => ({
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id],
	}),
	taskTags: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
	task: one(tasks, {
		fields: [taskTags.taskId],
		references: [tasks.id],
	}),
	tag: one(tags, {
		fields: [taskTags.tagId],
		references: [tags.id],
	}),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	taskTags: many(taskTags),
}));

export const taskListsRelations = relations(lists, ({ many }) => ({
	tasks: many(tasks),
}));
