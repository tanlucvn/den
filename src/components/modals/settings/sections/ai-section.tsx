"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const AI_PROVIDERS = [
	{ value: "openai", label: "OpenAI" },
	{ value: "bing", label: "Bing AI" },
	{ value: "google", label: "Gemini" },
	{ value: "custom", label: "Custom / Local" },
];

export default function AISection() {
	const [provider, setProvider] = useState("openai");
	const [apiKey, setApiKey] = useState("");
	const [baseUrl, setBaseUrl] = useState("");
	const [model, setModel] = useState("");

	const isCustom = provider === "custom";

	return (
		<div className="space-y-4">
			{/* AI Provider */}
			<div className="space-y-1">
				<Label className="text-muted-foreground text-xs">AI provider</Label>
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Provider</span>
					<Select value={provider} onValueChange={setProvider}>
						<SelectTrigger className="h-8 w-44 text-sm">
							<SelectValue placeholder="Select provider" />
						</SelectTrigger>
						<SelectContent>
							{AI_PROVIDERS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
									className="text-sm"
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* API Key */}
			<div className="space-y-1">
				<Label className="gap-1 text-muted-foreground text-xs">
					API key <span className="text-destructive">*</span>
				</Label>
				<Input
					type="password"
					placeholder="Enter your API key"
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
				/>
			</div>

			{/* Show extra fields if custom */}
			{isCustom && (
				<div className="space-y-2">
					{/* Base URL */}
					<div className="space-y-1">
						<Label className="text-muted-foreground text-xs">Base URL</Label>
						<Input
							type="url"
							placeholder="http://api.openai.com/v1/"
							value={baseUrl}
							onChange={(e) => setBaseUrl(e.target.value)}
						/>
					</div>

					{/* Model */}
					<div className="space-y-1">
						<Label className="gap-1 text-muted-foreground text-xs">
							Model <span className="text-destructive">*</span>
						</Label>
						<Input
							type="text"
							placeholder="e.g. gpt-4o-mini"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						/>
					</div>
				</div>
			)}

			<Separator />

			{/* Info box */}
			<div className="rounded-md border border-dashed p-3 text-muted-foreground text-xs leading-relaxed">
				<p>
					<IconRenderer name="Info" className="mr-1 inline" />
					Your API key is{" "}
					<span className="text-foreground">securely stored</span> in your
					browser.
				</p>
				<p className="mt-1">
					You can also connect to a custom provider compatible with OpenAI, like
					a local server (<code>Ollama</code>).
				</p>
			</div>
		</div>
	);
}
