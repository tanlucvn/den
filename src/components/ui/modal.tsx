"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import * as React from "react";
import { Drawer as DrawerPrimitive, Content as VaulDrawerContent } from "vaul";

import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";

type DrawerType = React.ComponentProps<typeof DrawerPrimitive.Root>;

type ModalContextProps = {
	modal?: boolean;
	dismissible?: boolean;
	direction?: "top" | "right" | "bottom" | "left";
	onlyDrawer?: boolean;
	onlyDialog?: boolean;
	alert?: boolean;
};

type ModalProviderProps = {
	children: React.ReactNode;
} & ModalContextProps;

const ModalContext = React.createContext<ModalContextProps>({});

const ModalProvider = ({
	modal = true,
	dismissible = true,
	direction = "bottom",
	onlyDrawer = false,
	onlyDialog = false,
	alert = false,
	children,
}: ModalProviderProps) => {
	return (
		<ModalContext.Provider
			value={{ modal, dismissible, direction, onlyDrawer, onlyDialog, alert }}
		>
			{children}
		</ModalContext.Provider>
	);
};

const useModal = () => {
	const context = React.useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used within a <Modal />");
	}

	return context;
};

const Modal = ({
	modal = true,
	dismissible = true,
	direction = "bottom",
	onlyDrawer = false,
	onlyDialog = false,
	alert = false,
	shouldScaleBackground = false,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	...props
}: DrawerType & {
	onlyDrawer?: boolean;
	onlyDialog?: boolean;
	alert?: boolean;
}) => {
	const [internalState, setInternalState] = React.useState<boolean>(false);

	const isControlledOpen = typeof controlledOpen === "undefined";
	const toggleInternalState = () => setInternalState((prev) => !prev);

	const open = isControlledOpen ? internalState : controlledOpen;
	const onOpenChange = isControlledOpen
		? toggleInternalState
		: controlledOnOpenChange;

	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const Modal = shouldUseDialog ? DialogPrimitive.Root : DrawerPrimitive.Root;

	const effectiveModal = alert ? true : modal;
	const effectiveDismissible = alert ? true : dismissible;

	return (
		<ModalProvider
			modal={effectiveModal}
			dismissible={effectiveDismissible}
			direction={direction}
			onlyDrawer={onlyDrawer}
			onlyDialog={onlyDialog}
			alert={alert}
		>
			<Modal
				modal={effectiveModal}
				direction={direction}
				dismissible={effectiveDismissible}
				shouldScaleBackground={shouldScaleBackground}
				open={open}
				onOpenChange={onOpenChange}
				{...props}
			/>
		</ModalProvider>
	);
};
Modal.displayName = "Modal";

const ModalTrigger = ({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
	const { onlyDrawer, onlyDialog } = useModal();
	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalTrigger = shouldUseDialog
		? DialogPrimitive.Trigger
		: DrawerPrimitive.Trigger;
	return <ModalTrigger {...props} />;
};
ModalTrigger.displayName = "ModalTrigger";

const ModalPortal = ({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
	const { onlyDrawer, onlyDialog } = useModal();
	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalPortal = shouldUseDialog
		? DialogPrimitive.Portal
		: DrawerPrimitive.Portal;
	return <ModalPortal {...props} />;
};
ModalPortal.displayName = "ModalPortal";

const ModalOverlay = ({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
	return (
		<DialogPrimitive.Overlay
			{...props}
			className={cn(
				"sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
				className,
			)}
		/>
	);
};
ModalOverlay.displayName = "ModalOverlay";

const ModalClose = ({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) => {
	const { dismissible, alert, onlyDrawer, onlyDialog } = useModal();
	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalClose = shouldUseDialog
		? DialogPrimitive.Close
		: DrawerPrimitive.Close;

	const shouldPreventClose = !dismissible && !alert;

	return (
		<ModalClose
			aria-label="Close"
			{...(shouldPreventClose && { onClick: (e) => e.preventDefault() })}
			{...props}
		/>
	);
};
ModalClose.displayName = "ModalClose";

const ModalContentVariants = cva("fixed z-50 bg-card", {
	variants: {
		device: {
			desktop:
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 top-1/2 left-1/2 grid max-h-[calc(100%-4rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",
			mobile: "flex ",
		},
		direction: {
			bottom: "",
			top: "",
			left: "",
			right: "",
		},
	},
	defaultVariants: {
		device: "desktop",
		direction: "bottom",
	},
	compoundVariants: [
		{
			device: "mobile",
			direction: "bottom",
			className:
				"!border-b-0 inset-x-0 bottom-0 mt-24 h-fit max-h-[95%] flex-col rounded-t-[10px] border border-primary/10 pt-4",
		},
		{
			device: "mobile",
			direction: "top",
			className:
				"!border-b-0 inset-x-0 top-0 mb-24 h-fit max-h-[95%] flex-col rounded-b-[10px] border border-primary/10",
		},
		{
			device: "mobile",
			direction: "left",
			className:
				"top-2 bottom-2 left-2 flex w-[310px] bg-transparent outline-none [--initial-transform:calc(100%+8px)]",
		},
		{
			device: "mobile",
			direction: "right",
			className:
				"top-2 right-2 bottom-2 w-[310px] bg-transparent outline-none [--initial-transform:calc(100%+8px)]",
		},
	],
});

const ModalContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		showCloseButton?: boolean;
	}
>(({ className, children, showCloseButton = true, ...props }, ref) => {
	const { direction, modal, dismissible, alert, onlyDrawer, onlyDialog } =
		useModal();

	const isMobile = useIsMobile();
	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalContent = shouldUseDialog
		? DialogPrimitive.Content
		: VaulDrawerContent;

	const shouldShowCloseButton = !alert && showCloseButton;
	const shouldPreventEscape = !dismissible && !alert;
	const shouldPreventOutsideInteraction =
		!modal || (!dismissible && !alert) || alert;

	return (
		<>
			<ModalPortal>
				<ModalOverlay />
			</ModalPortal>
			<ModalPortal>
				<ModalContent
					ref={ref}
					{...props}
					{...(shouldPreventEscape &&
						shouldUseDialog && {
							onEscapeKeyDown: (e) => e.preventDefault(),
						})}
					{...(shouldPreventOutsideInteraction &&
						shouldUseDialog && {
							onInteractOutside: (e) => e.preventDefault(),
						})}
					{...(!shouldUseDialog &&
						shouldPreventOutsideInteraction && {
							onPointerDownOutside: (e) => e.preventDefault(),
							onInteractOutside: (e) => e.preventDefault(),
						})}
					className={cn(
						ModalContentVariants({
							device: shouldUseDialog ? "desktop" : "mobile",
							direction,
						}),
						"flex flex-col gap-4 bg-card px-6 py-4",
						className,
					)}
				>
					{!shouldUseDialog && direction === "bottom" && (
						<div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-muted-foreground/25 pb-1.5 data-[vaul-handle]:h-1.5 data-[vaul-handle]:w-14 data-[vaul-handle]:pb-1.5 dark:bg-muted" />
					)}
					{children}
					{shouldShowCloseButton && (
						<ModalClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-white">
							<X className="size-4" />
							<span className="sr-only">close</span>
						</ModalClose>
					)}
				</ModalContent>
			</ModalPortal>
		</>
	);
});
ModalContent.displayName = "ModalContent";

const ModalHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 p-4 text-center sm:p-0 sm:text-left",
				className,
			)}
			{...props}
		/>
	);
};
ModalHeader.displayName = "ModalHeader";

const ModalFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<footer
			className={cn(
				"flex flex-col-reverse gap-4 p-4 max-sm:mt-auto sm:flex-row sm:justify-end sm:gap-2 sm:p-0",
				className,
			)}
			{...props}
		/>
	);
};
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
	const { onlyDrawer, onlyDialog } = useModal();
	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalTitle = shouldUseDialog
		? DialogPrimitive.Title
		: DrawerPrimitive.Title;
	return (
		<ModalTitle
			ref={ref}
			className={cn(
				"font-semibold text-lg leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
});

ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
	const { onlyDrawer, onlyDialog } = useModal();
	const isMobile = useIsMobile();

	const shouldUseDialog = onlyDialog || (!onlyDrawer && !isMobile);
	const ModalDescription = shouldUseDialog
		? DialogPrimitive.Description
		: DrawerPrimitive.Description;
	return (
		<ModalDescription
			ref={ref}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
});

ModalDescription.displayName = "ModalDescription";

export {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalPortal,
	ModalTitle,
	ModalTrigger,
};
