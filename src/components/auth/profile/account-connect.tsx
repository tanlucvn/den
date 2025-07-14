"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient, type Session } from "@/lib/auth-client";

type Provider = "github" | "google";

interface AccountConnectProps {
	data: Session | null;
}

const PROVIDERS: { id: Provider; label: string; icon: string }[] = [
	{ id: "github", label: "GitHub", icon: "Github" },
	{ id: "google", label: "Google", icon: "Chrome" },
];

export function AccountConnect({ data }: AccountConnectProps) {
	const [accounts, setAccounts] = useState<
		{ id: string; providerId: Provider }[]
	>([]);
	const [isLinking, setIsLinking] = useState<Provider | null>(null);
	const [isUnlinking, setIsUnlinking] = useState<Provider | null>(null);

	const loadAccounts = useCallback(async () => {
		try {
			const { data } = await authClient.listAccounts();
			setAccounts(
				data?.map(({ accountId, provider }) => ({
					id: accountId,
					providerId: provider as Provider,
				})) || [],
			);
		} catch (error) {
			toast.error("Failed to load accounts", {
				description: error instanceof Error ? error.message : undefined,
			});
		}
	}, []);

	const handleLinkAccount = async (provider: Provider) => {
		try {
			setIsLinking(provider);
			await authClient.linkSocial(
				{ provider, callbackURL: "/profile" },
				{
					onSuccess: () => {
						toast.success(`Successfully linked ${provider}`);
						loadAccounts();
					},
					onError: (ctx) => {
						toast.error(`Failed to link ${provider}`, {
							description: ctx.error.message,
						});
					},
					onSettled: () => setIsLinking(null),
				},
			);
		} catch {
			toast.error(`Failed to link ${provider}`);
			setIsLinking(null);
		}
	};

	const handleUnlinkAccount = async (provider: Provider) => {
		try {
			setIsUnlinking(provider);
			const target = accounts.find((acc) => acc.providerId === provider);
			if (!target) throw new Error("Account not found");

			await authClient.unlinkAccount(
				{ providerId: provider, accountId: target.id },
				{
					onSuccess: () => {
						toast.success(`Unlinked ${provider}`);
						loadAccounts();
					},
					onError: (ctx) => {
						toast.error(`Failed to unlink ${provider}`, {
							description: ctx.error.message,
						});
					},
					onSettled: () => setIsUnlinking(null),
				},
			);
		} catch (err) {
			toast.error(`Failed to unlink ${provider}`, {
				description: err instanceof Error ? err.message : "Unknown error",
			});
			setIsUnlinking(null);
		}
	};

	useEffect(() => {
		loadAccounts();
	}, [loadAccounts]);

	if (!data) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-semibold text-xl">
					Connected Accounts
				</CardTitle>
				<CardDescription>
					Connect your account with third-party providers for easier sign in.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{PROVIDERS.map(({ id, label, icon }) => {
					const connected = accounts.some((acc) => acc.providerId === id);
					const isLoading =
						(id === isLinking && !connected) ||
						(id === isUnlinking && connected);

					return (
						<div key={id} className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<IconRenderer name={icon} />
								<span>{label}</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								disabled={isLoading || (connected && accounts.length === 1)}
								onClick={() =>
									connected ? handleUnlinkAccount(id) : handleLinkAccount(id)
								}
							>
								{isLoading ? (
									<>
										<IconRenderer
											name="Loader2"
											className="mr-2 h-4 w-4 animate-spin"
										/>
										{connected ? "Unlinking..." : "Connecting..."}
									</>
								) : connected ? (
									"Disconnect"
								) : (
									"Connect"
								)}
							</Button>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
