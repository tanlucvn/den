"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AISection from "./sections/ai-section";
import AppearanceSection from "./sections/appearance-section";

const tabConfigs = [
	{
		value: "appearance",
		title: "Appearance",
		icon: "Palette",
		content: <AppearanceSection />,
	},
	{
		value: "ai",
		title: "AI",
		icon: "Bot",
		content: <AISection />,
	},
];

interface SettingsModalProps {
	children: React.ReactNode;
}

const SettingsModal = ({ children }: SettingsModalProps) => {
	const [selectedTab, setSelectedTab] = useState("appearance");

	return (
		<Modal>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:h-[600px] sm:max-w-[500px]">
				<ModalHeader className="p-0">
					<ModalTitle>Settings</ModalTitle>
					<ModalDescription>Customize your app experience.</ModalDescription>
				</ModalHeader>

				<Tabs
					value={selectedTab}
					onValueChange={setSelectedTab}
					className="min-h-0 space-y-4"
				>
					<TabsList className="flex w-full items-center justify-evenly gap-0 rounded-full border p-0">
						{tabConfigs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="w-full shrink rounded-full"
							>
								<IconRenderer name={tab.icon} className="h-4 w-4" />
								{selectedTab === tab.value && tab.title}
							</TabsTrigger>
						))}
					</TabsList>

					{tabConfigs.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="min-h-0 overflow-y-auto"
						>
							{tab.content}
						</TabsContent>
					))}
				</Tabs>
			</ModalContent>
		</Modal>
	);
};

export default SettingsModal;
