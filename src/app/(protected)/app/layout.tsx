"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { AppQuickActions } from "@/components/common/app-quick-actions";
import AppHeader from "@/components/common/header";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useTodoStore } from "@/store/use-todo-store";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const { user } = useUser();
	const { supabase } = useSupabase();
	const { fetchTodos } = useTodoStore();

	useEffect(() => {
		if (supabase && user) {
			fetchTodos(supabase);
		}
	}, [user, supabase, fetchTodos]);

	return (
		<div className="relative flex min-h-screen flex-col gap-2 bg-background">
			<header className="px-4">
				<AppHeader />
			</header>

			<div className="sticky top-0 z-10 w-full bg-background p-4">
				<AppQuickActions />
			</div>

			<main className="flex-1 px-4">
				<div className="mx-auto w-full max-w-4xl">{children}</div>
			</main>
		</div>
	);
}
