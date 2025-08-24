"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type AsideContext = {
	open: boolean; // desktop state
	setOpen: (open: boolean) => void;
	openMobile: boolean; // mobile state
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleAside: () => void;
};

const AsideContext = createContext<AsideContext | null>(null);

export function useAside() {
	const context = useContext(AsideContext);
	if (!context) {
		throw new Error("useAside must be used within an AsideProvider.");
	}
	return context;
}

export const AsideProvider = ({ children }: { children: React.ReactNode }) => {
	const isMobile = useIsMobile(1024);
	const [open, setOpen] = useState(true); // desktop
	const [openMobile, setOpenMobile] = useState(false); // mobile

	const toggleAside = useCallback(() => {
		if (isMobile) {
			setOpenMobile((prev) => !prev);
		} else {
			setOpen((prev) => !prev);
		}
	}, [isMobile]);

	const contextValue = useMemo<AsideContext>(
		() => ({
			isMobile,
			open,
			setOpen,
			openMobile,
			setOpenMobile,
			toggleAside,
		}),
		[isMobile, open, openMobile, toggleAside],
	);

	return (
		<AsideContext.Provider value={contextValue}>
			{children}
		</AsideContext.Provider>
	);
};
AsideProvider.displayName = "AsideProvider";

interface AsideProps {
	children?: ReactNode;
}

export const Aside = ({ children }: AsideProps) => {
	const { isMobile, open, openMobile, setOpenMobile } = useAside();

	if (isMobile) {
		return (
			<Modal
				open={openMobile}
				onOpenChange={setOpenMobile}
				direction="right"
				onlyDrawer
			>
				<ModalContent className="w-[20rem] rounded-lg p-4 after:hidden after:content-none [&>button]:hidden">
					<ModalHeader className="sr-only">
						<ModalTitle>Aside Panel</ModalTitle>
						<ModalDescription>
							Displays the mobile aside panel.
						</ModalDescription>
					</ModalHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</ModalContent>
			</Modal>
		);
	}

	return (
		<aside
			className={cn(
				"overflow-hidden bg-sidebar transition-all duration-300 ease-in-out",
				open ? "w-[20rem] border-l" : "pointer-events-none w-0",
			)}
			aria-hidden={!open}
		>
			<div
				className={cn(
					"h-full overflow-auto p-4 transition-opacity duration-200",
					open ? "opacity-100" : "opacity-0",
				)}
			>
				{children}
			</div>
		</aside>
	);
};
Aside.displayName = "Aside";

export const AsideTrigger = ({
	onClick,
}: {
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const { toggleAside } = useAside();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={(event) => {
				onClick?.(event);
				toggleAside();
			}}
		>
			<IconRenderer name="AlignRight" />
		</Button>
	);
};
AsideTrigger.displayName = "AsideTrigger";
