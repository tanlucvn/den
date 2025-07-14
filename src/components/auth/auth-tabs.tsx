import BillingTab from "@/components/auth/billing/billing-tab";
import { ProfileSkeleton } from "@/components/auth/profile/profile-skeleton";
import { ProfileTab } from "@/components/auth/profile/profile-tab";
import SecurityTab from "@/components/auth/security/security-tab";
import { IconRenderer } from "@/components/icon-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Session } from "@/lib/auth-client";

interface AuthTabsProps {
	session: Session | null;
}

export async function AuthTabs({ session }: AuthTabsProps) {
	const tabs = [
		{
			value: "profile",
			label: "Profile",
			icon: <IconRenderer name="UserCircle" />,
			content: session ? <ProfileTab data={session} /> : <ProfileSkeleton />,
		},
		{
			value: "billing",
			label: "Billing",
			icon: <IconRenderer name="CreditCard" />,
			content: <BillingTab />,
		},
		{
			value: "security",
			label: "Security",
			icon: <IconRenderer name="Shield" />,
			content: <SecurityTab />,
		},
	];

	return (
		<Tabs defaultValue="profile" className="w-full space-y-4">
			<TabsList className="w-full justify-start gap-2 rounded-none border-border border-b bg-transparent px-0 py-1">
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className="after:-mb-1 relative flex items-center gap-2 text-muted-foreground shadow-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
					>
						{tab.icon}
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>

			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
