import { useCallback, useEffect, useMemo, useState } from "react";

export function useSound(url: string, volume = 0.5) {
	const [muted, setMuted] = useState(false);

	const audio = useMemo(() => {
		if (typeof window !== "undefined") return new Audio(url);
		return null;
	}, [url]);

	useEffect(() => {
		if (audio) {
			audio.volume = muted ? 0 : volume;
		}
	}, [volume, muted, audio]);

	const play = useCallback(() => {
		if (audio && !muted) audio.play();
	}, [audio, muted]);

	return { play, muted, setMuted };
}
