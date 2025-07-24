"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import AISection from "./sections/ai-section";
import AppearanceSection from "./sections/appearance-section";

const tabConfigs = [
	{
		title: "Appearance",
		icon: <IconRenderer name="Palette" />,
		content: <AppearanceSection />,
	},
	{
		title: "AI",
		icon: <IconRenderer name="Bot" />,
		content: <AISection />,
	},
	{
		title: "Feedback",
		icon: <IconRenderer name="MessageSquare" />,
		content: <div>Document settings and storage.</div>,
	},
	{
		title: "Data",
		icon: <IconRenderer name="Database" />,
		content: <div>Privacy preferences and permissions.</div>,
	},
];

interface SettingsModalProps {
	children: React.ReactNode;
}

const SettingsModal = ({ children }: SettingsModalProps) => {
	const [selectedTab, setSelectedTab] = useState<number | null>(0);

	return (
		<Modal>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="sm:h-[600px]">
				<ModalHeader>
					<ModalTitle>Settings</ModalTitle>
					<ModalDescription>Customize your app experience.</ModalDescription>
				</ModalHeader>

				<ExpandableTabs
					tabs={tabConfigs.map(({ title, icon }) => ({ title, icon }))}
					value={selectedTab}
					onChange={(index) => setSelectedTab(index)}
				/>

				{selectedTab !== null && tabConfigs[selectedTab].content}
			</ModalContent>
		</Modal>
	);
};

export default SettingsModal;
