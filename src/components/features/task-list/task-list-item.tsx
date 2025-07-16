import { IconRenderer } from "@/components/icon-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskListItemProps {
	title: string;
	onClick?: () => void;
	className?: string;
}

export function TaskListItem({ title, onClick, className }: TaskListItemProps) {
	return (
		<Card
			onClick={onClick}
			className={cn(
				"group w-full cursor-pointer border border-muted bg-background transition-all hover:border-primary hover:bg-muted/40 hover:shadow-sm",
				className,
			)}
		>
			<CardContent className="space-y-2 p-4">
				<div className="flex items-center justify-between">
					<span className="truncate font-medium text-sm group-hover:text-primary">
						{title}
					</span>
					<IconRenderer
						name="ChevronRight"
						className="h-4 w-4 text-muted-foreground group-hover:text-primary"
					/>
				</div>
				{/* Placeholder for future info like task count, createdAt, etc. */}
				<p className="text-muted-foreground text-xs">Click to view tasks</p>
			</CardContent>
		</Card>
	);
}
