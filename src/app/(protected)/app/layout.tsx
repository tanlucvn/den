"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { AppQuickActions } from "@/components/common/app-quick-actions";
import AppHeader from "@/components/common/header";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useTaskStore } from "@/store/use-task-store";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const { user } = useUser();
	const { supabase } = useSupabase();
	const { fetchTasks } = useTaskStore();
	const fetchedRef = useRef(false);

	useEffect(() => {
		if (supabase && user && !fetchedRef.current) {
			fetchedRef.current = true;
			fetchTasks(supabase);
		}
	}, [user, supabase, fetchTasks]);

	return (
		<div className="relative flex min-h-screen flex-col gap-6 bg-background">
			<header className="px-4">
				<AppHeader />
			</header>

			<div className="sticky top-2 z-10 w-full px-4">
				<AppQuickActions />
			</div>

			<main className="flex-1 px-4">
				<div className="mx-auto w-full max-w-4xl">{children}</div>
			</main>
		</div>
	);
}
