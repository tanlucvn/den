import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-[340px]" />
			<Skeleton className="h-24" />
		</div>
	);
}
