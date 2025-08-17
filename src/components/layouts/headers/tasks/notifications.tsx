"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function Notifications() {
	const [notifications, setNotifications] = useState({
		teamIssueAdded: false,
		issueCompleted: false,
		issueAddedToTriage: false,
	});

	const handleCheckboxChange = (key: keyof typeof notifications) => {
		setNotifications((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="relative"
					aria-label="Notifications"
				>
					<IconRenderer name="Bell" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="px-4 pt-3 pb-3">
					<h3 className="mb-3 font-medium text-sm">Inbox notifications</h3>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label
								htmlFor="team-issue-added"
								className="flex-1 cursor-pointer text-muted-foreground text-xs"
							>
								An issue is added to the team
							</label>
							<Checkbox
								id="team-issue-added"
								checked={notifications.teamIssueAdded}
								onCheckedChange={() => handleCheckboxChange("teamIssueAdded")}
							/>
						</div>

						<div className="flex items-center justify-between">
							<label
								htmlFor="issue-completed"
								className="flex-1 cursor-pointer text-muted-foreground text-xs"
							>
								An issue is marked completed or canceled
							</label>
							<Checkbox
								id="issue-completed"
								checked={notifications.issueCompleted}
								onCheckedChange={() => handleCheckboxChange("issueCompleted")}
							/>
						</div>

						<div className="flex items-center justify-between">
							<label
								htmlFor="issue-triage"
								className="flex-1 cursor-pointer text-muted-foreground text-xs"
							>
								An issue is added to the triage queue
							</label>
							<Checkbox
								id="issue-triage"
								checked={notifications.issueAddedToTriage}
								onCheckedChange={() =>
									handleCheckboxChange("issueAddedToTriage")
								}
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
