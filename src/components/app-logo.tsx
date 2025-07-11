import type * as React from "react";
import { cn } from "@/lib/utils";

export function AppLogo({
	className,
	...props
}: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 541 636.45"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			className={cn("h-4 w-4", className)}
			{...props}
		>
			<title id="logo">Den Logo</title>
			<g transform="scale(-1,1) translate(-541, 0)">
				<path
					fill="currentColor"
					d="M182,123.42l136.22,48.87.31,83.78q107.93-62,225.82-19.76C754.66,311.85,783.23,587,609,710.16c-175.06,123.39-424.85,4.66-425.77-219.82ZM327,445c-27.32,76.36,14.8,147.22,81.1,171.07,79.56,28.57,148.69-20,170.39-80.82,28.12-78.08-20-149.17-80.16-170.74C428.9,339.57,352.32,374.18,327,445Z"
					transform="translate(-181.99 -123.42)"
				/>
			</g>
		</svg>
	);
}
