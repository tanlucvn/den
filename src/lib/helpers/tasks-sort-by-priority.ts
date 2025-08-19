const PRIORITY_ORDER: Record<string, number> = {
	high: 1,
	medium: 2,
	low: 3,
	none: 4,
};

export function sortByPriority<T extends { priority?: string }>(a: T, b: T) {
	return (
		(PRIORITY_ORDER[a.priority ?? "none"] ?? 4) -
		(PRIORITY_ORDER[b.priority ?? "none"] ?? 4)
	);
}
