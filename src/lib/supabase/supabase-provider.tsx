"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

type SupabaseContext = {
	supabase: SupabaseClient | null;
	isLoaded: boolean;
};

const Context = createContext<SupabaseContext>({
	supabase: null,
	isLoaded: false,
});

type Props = {
	children: React.ReactNode;
};

export default function SupabaseProvider({ children }: Props) {
	const { data } = useSession();
	const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (!data?.session.token) return;

		const client = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		);

		setSupabase(client);
		setIsLoaded(true);
	}, [data?.session.token]);

	return (
		<Context.Provider value={{ supabase, isLoaded }}>
			{!isLoaded ? <div>Loading...</div> : children}
		</Context.Provider>
	);
}

export const useSupabase = () => {
	const context = useContext(Context);
	if (context === undefined) {
		throw new Error("useSupabase must be used within a SupabaseProvider");
	}
	return {
		supabase: context.supabase,
		isLoaded: context.isLoaded,
	};
};
