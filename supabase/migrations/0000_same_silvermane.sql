CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"due_date" date,
	"completed" boolean DEFAULT false,
	"priority" text DEFAULT 'medium',
	"tags" text[],
	"created_at" timestamp DEFAULT now()
);
