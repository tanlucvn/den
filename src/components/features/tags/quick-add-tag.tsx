"use client";

import QuickAddTagForm from "@/components/forms/tags/quick-add-tag-form";
import { IconRenderer } from "@/components/icon-renderer";
import NewTagModal from "@/components/modals/tags/new-tag-modal";
import { Button } from "@/components/ui/button";

export default function QuickAddTag() {
	return (
		<div className="relative w-full">
			<QuickAddTagForm />

			<NewTagModal>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="absolute top-1 right-17 size-7 rounded-full text-muted-foreground"
				>
					<IconRenderer name="Maximize2" />
				</Button>
			</NewTagModal>
		</div>
	);
}
