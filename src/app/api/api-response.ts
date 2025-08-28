import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

export async function requireSession() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		throw new Error("Unauthorized");
	}
	return session;
}

export function handleError(error: unknown) {
	if (error instanceof Error && error.message === "Unauthorized") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (error instanceof ZodError) {
		return NextResponse.json(
			{ error: "Validation failed", issues: error.errors },
			{ status: 400 },
		);
	}
	return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export function notFound(message: string = "Not found") {
	return NextResponse.json({ error: message }, { status: 404 });
}

export function successMessage(message: string, status: number = 200) {
	return NextResponse.json({ message }, { status: status });
}

export function success(data: unknown, status = 200) {
	return NextResponse.json(data, { status });
}
