import * as React from "react";

import { cn } from "@/lib/utils";

const InputWrapper = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn("relative w-full rounded-md", className)}
			ref={ref}
			{...props}
		/>
	);
});
InputWrapper.displayName = "InputWrapper";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				data-slot="input"
				className={cn(
					"flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
					"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
					"aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

const InputPrefix = React.forwardRef<
	React.ElementRef<"div">,
	React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
	return (
		<span
			ref={ref}
			className={cn(
				"-translate-y-1/2 absolute top-1/2 left-2 flex h-full items-center justify-center",
				className,
			)}
			{...props}
		/>
	);
});
InputPrefix.displayName = "InputPrefix";

const InputSuffix = React.forwardRef<
	React.ElementRef<"div">,
	React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
	return (
		<span
			ref={ref}
			className={cn(
				"-translate-y-1/2 absolute top-1/2 right-2 flex h-full items-center justify-center",
				className,
			)}
			{...props}
		/>
	);
});
InputSuffix.displayName = "InputSuffix";

const InputGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ children, className, ...props }: any, ref: React.Ref<HTMLDivElement>) => {
	return (
		<div
			ref={ref}
			className={cn(
				"flex w-full items-center rounded-md [&>*]:rounded-none [&>*]:first:rounded-l-[inherit] [&>*]:last:rounded-r-[inherit]",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});

InputGroup.displayName = "InputGroup";

const InputAddon = React.forwardRef<
	React.ElementRef<"div">,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"flex min-h-9 shrink-0 items-center justify-center border border-input border-solid bg-muted px-2",
				className,
			)}
			{...props}
		/>
	);
});
InputAddon.displayName = "InputAddon";

export {
	Input,
	InputAddon,
	InputGroup,
	InputPrefix,
	InputSuffix,
	InputWrapper,
};
