import ClientProviders from "@/components/layouts/client-providers";

interface LayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
	return <ClientProviders>{children}</ClientProviders>;
}
