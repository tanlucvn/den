import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

function kebabToPascalCase(str: string): string {
	return str
		.split("-")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
}

interface IconRendererProps {
	name: string;
	className?: string;
	size?: number;
}

export function IconRenderer({
	name,
	className,
	size = 16,
}: IconRendererProps) {
	const iconName = kebabToPascalCase(name);
	const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;
	return Icon ? <Icon className={cn("size-4", className)} size={size} /> : null;
}
