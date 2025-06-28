import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface IconRendererProps {
	name: string;
	className?: string;
}

export function IconRenderer({ name, className }: IconRendererProps) {
	const Icon = Icons[name as keyof typeof Icons] as LucideIcon;
	return Icon ? <Icon className={cn("size-4", className)} /> : null;
}
