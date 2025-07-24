import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppColor = "default" | "beige" | "zinc" | "neutral" | "gray";

interface AppSettingsStore {
	appColor: AppColor;
	setAppColor: (color: AppColor) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>()(
	persist(
		(set) => ({
			appColor: "default",
			setAppColor: (color) => set({ appColor: color }),
		}),
		{
			name: "app-settings-store",
		},
	),
);
