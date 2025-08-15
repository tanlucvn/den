import { create } from "zustand";

export interface FilterState {
	// Filter options
	filters: {
		status: string[];
		priority: string[];
		labels: string[];
	};

	// Actions
	setFilter: (type: "status" | "priority" | "labels", ids: string[]) => void;
	toggleFilter: (type: "status" | "priority" | "labels", id: string) => void;
	clearFilters: () => void;
	clearFilterType: (type: "status" | "priority" | "labels") => void;

	// Utility
	hasActiveFilters: () => boolean;
	getActiveFiltersCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
	// Initial state
	filters: {
		status: [],
		priority: [],
		labels: [],
	},

	// Actions
	setFilter: (type, ids) => {
		set((state) => ({
			filters: {
				...state.filters,
				[type]: ids,
			},
		}));
	},

	toggleFilter: (type, id) => {
		set((state) => {
			const currentFilters = state.filters[type];
			const newFilters = currentFilters.includes(id)
				? currentFilters.filter((item) => item !== id)
				: [...currentFilters, id];

			return {
				filters: {
					...state.filters,
					[type]: newFilters,
				},
			};
		});
	},

	clearFilters: () => {
		set({
			filters: {
				status: [],
				priority: [],
				labels: [],
			},
		});
	},

	clearFilterType: (type) => {
		set((state) => ({
			filters: {
				...state.filters,
				[type]: [],
			},
		}));
	},

	// Utility
	hasActiveFilters: () => {
		const { filters } = get();
		return Object.values(filters).some((filterArray) => filterArray.length > 0);
	},

	getActiveFiltersCount: () => {
		const { filters } = get();
		return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
	},
}));
