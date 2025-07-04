"use client";

import * as React from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BaseProps {
	children: React.ReactNode;
}

interface RootModalProps extends BaseProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

interface ModalProps extends BaseProps {
	className?: string;
	asChild?: true;
}

const ModalContext = React.createContext<{ isMobile: boolean }>({
	isMobile: false,
});

const useModalContext = () => {
	const context = React.useContext(ModalContext);
	if (!context) {
		throw new Error(
			"Modal components cannot be rendered outside the Modal Context",
		);
	}
	return context;
};

const Modal = ({ children, ...props }: RootModalProps) => {
	const isMobile = useIsMobile();
	const Modal = isMobile ? Drawer : Dialog;

	return (
		<ModalContext.Provider value={{ isMobile }}>
			<Modal {...props} {...(isMobile && { autoFocus: true })}>
				{children}
			</Modal>
		</ModalContext.Provider>
	);
};

const ModalTrigger = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;

	return (
		<ModalTrigger className={className} {...props}>
			{children}
		</ModalTrigger>
	);
};

const ModalClose = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalClose = isMobile ? DrawerClose : DialogClose;

	return (
		<ModalClose className={className} {...props}>
			{children}
		</ModalClose>
	);
};

const ModalContent = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalContent = isMobile ? DrawerContent : DialogContent;

	return (
		<ModalContent
			className={cn(
				"max-md:!right-2 max-md:!bottom-2 max-md:!left-2 after:hidden after:content-none max-md:rounded-md max-md:border",
				className,
			)}
			{...props}
		>
			{children}
		</ModalContent>
	);
};

const ModalDescription = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalDescription = isMobile ? DrawerDescription : DialogDescription;

	return (
		<ModalDescription
			className={cn(
				"select-none text-center font-medium text-muted-foreground text-xs",
				className,
			)}
			{...props}
		>
			{children}
		</ModalDescription>
	);
};

const ModalHeader = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalHeader = isMobile ? DrawerHeader : DialogHeader;

	return (
		<ModalHeader className={cn("p-0", className)} {...props}>
			{children}
		</ModalHeader>
	);
};

const ModalTitle = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalTitle = isMobile ? DrawerTitle : DialogTitle;

	return (
		<ModalTitle
			className={cn(
				"-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 select-none rounded-full border bg-background p-0.5",
				className,
			)}
			{...props}
		>
			<div className="rounded-full px-3 py-1.5 font-medium text-sm leading-none">
				{children}
			</div>
		</ModalTitle>
	);
};

const ModalBody = ({ className, children, ...props }: ModalProps) => {
	return (
		<div className={cn("px-4 md:px-0", className)} {...props}>
			{children}
		</div>
	);
};

const ModalFooter = ({ className, children, ...props }: ModalProps) => {
	const { isMobile } = useModalContext();
	const ModalFooter = isMobile ? DrawerFooter : DialogFooter;

	return (
		<ModalFooter className={cn("mt-4 max-md:p-0", className)} {...props}>
			{children}
		</ModalFooter>
	);
};

export {
	Modal,
	ModalBody,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
};
