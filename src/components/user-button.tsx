import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { IconRenderer } from "./icon-renderer";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function UserButton() {
	const router = useRouter();

	const { data: session } = useSession();

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
			router.push("/");
		} catch {
			toast.error("Failed to sign out");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<IconRenderer name="Menu" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="font-medium text-sm leading-none">
							{session?.user.name}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{session?.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/profile">
						<DropdownMenuItem className="cursor-pointer">
							<IconRenderer name="User" />
							<span>Profile</span>
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
					<IconRenderer name="LogOut" className="text-destructive" />
					<span className="text-destructive/80">Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
