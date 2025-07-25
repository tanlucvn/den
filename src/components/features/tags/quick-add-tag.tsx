"use client";

import QuickAddTagForm from "@/components/forms/quick-add-tag-form";
import { IconRenderer } from "@/components/icon-renderer";
import NewTagModal from "@/components/modals/new-tag-modal";
import { Button } from "@/components/ui/button";

export default function QuickAddTag() {
	const formId = "quick-add-tag-form";

	return (
		<div className="relative w-full">
			<QuickAddTagForm formId={formId} />

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
