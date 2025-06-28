import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function AppLayout({ children }: Props) {
	return (
		<div className="container mx-auto h-[100dvh] px-5 md:px-0">
			<div className="mx-auto w-full py-4 md:w-11/12 lg:w-9/12 lg:px-20 xl:w-7/12">
				{children}
			</div>
		</div>
	);
}
