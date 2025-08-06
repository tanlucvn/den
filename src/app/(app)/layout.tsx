import AppLayout from "@/components/layouts/app-layout";

interface LayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return <AppLayout>{children}</AppLayout>;
}
