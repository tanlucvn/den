import { create } from "zustand";

export type EntityType = "tasks" | "lists" | "tags";
export type FilterType = "status" | "priority" | "tags" | "color" | "icon";

export interface EntityFilters {
	status: string[];
	priority: string[];
	tags: string[];
	color: string[];
	icon: string[];
}

interface FilterStore {
	entities: Record<EntityType, EntityFilters>;

	// Actions
	setFilter: (entity: EntityType, type: FilterType, ids: string[]) => void;
	toggleFilter: (entity: EntityType, type: FilterType, id: string) => void;
	clearFilters: (entity: EntityType) => void;
	clearFilterType: (entity: EntityType, type: FilterType) => void;

	// Utility
	hasActiveFilters: (entity: EntityType) => boolean;
	getActiveFiltersCount: (entity: EntityType) => number;
}

const initialFilters: EntityFilters = {
	// Tasks
	status: [],
	priority: [],
	tags: [],

	// Task Lists
	color: [],
	icon: [],
};

export const useFilterStore = create<FilterStore>((set, get) => ({
	entities: {
		tasks: { ...initialFilters },
		lists: { ...initialFilters },
		tags: { ...initialFilters },
	},

	setFilter: (entity, type, ids) => {
		set((state) => ({
			entities: {
				...state.entities,
				[entity]: {
					...state.entities[entity],
					[type]: ids,
				},
			},
		}));
	},

	toggleFilter: (entity, type, id) => {
		set((state) => {
			const currentFilters = state.entities[entity][type];
			const newFilters = currentFilters.includes(id)
				? currentFilters.filter((item) => item !== id)
				: [...currentFilters, id];

			return {
				entities: {
					...state.entities,
					[entity]: {
						...state.entities[entity],
						[type]: newFilters,
					},
				},
			};
		});
	},

	clearFilters: (entity) => {
		set((state) => ({
			entities: {
				...state.entities,
				[entity]: { ...initialFilters },
			},
		}));
	},

	clearFilterType: (entity, type) => {
		set((state) => ({
			entities: {
				...state.entities,
				[entity]: {
					...state.entities[entity],
					[type]: [],
				},
			},
		}));
	},

	hasActiveFilters: (entity) => {
		const { entities } = get();
		return Object.values(entities[entity]).some((arr) => arr.length > 0);
	},

	getActiveFiltersCount: (entity) => {
		const { entities } = get();
		return Object.values(entities[entity]).reduce(
			(acc, arr) => acc + arr.length,
			0,
		);
	},
}));
