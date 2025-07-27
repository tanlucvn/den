import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import { IconRenderer } from "@/components/icon-renderer";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";

const QUOTES = [
	{
		text: "The future depends on what you do today.",
		author: "Mahatma Gandhi",
	},
	{
		text: "Success is not final, failure is not fatal.",
		author: "Winston Churchill",
	},
	{
		text: "Don't watch the clock; do what it does. Keep going.",
		author: "Sam Levenson",
	},
	{
		text: "Believe you can and you're halfway there.",
		author: "Theodore Roosevelt",
	},
	{
		text: "Start where you are. Use what you have. Do what you can.",
		author: "Arthur Ashe",
	},
];

interface Props {
	children: React.ReactNode;
	onFinish: () => void;
	title: string;
}

export function PomodoroTimerDialog({ children, onFinish, title }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [duration, setDuration] = useState(25);
	const [timeLeft, setTimeLeft] = useState(1500);
	const [isRunning, setIsRunning] = useState(false);
	const [quoteIndex, setQuoteIndex] = useState(0);
	const [muted, setMuted] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const quoteRef = useRef<NodeJS.Timeout | null>(null);
	const hasCompletedRef = useRef(false);

	const [play] = useSound("/sounds/complete.mp3", {
		volume: 0.5,
		soundEnabled: !muted,
		preload: true,
	});

	const formatTime = (s: number) =>
		`${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

	const reset = useCallback(() => {
		clearInterval(intervalRef.current!);
		clearInterval(quoteRef.current!);
		setIsRunning(false);
		setDuration(25);
		setTimeLeft(1500);
		setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
	}, []);

	useEffect(() => {
		if (isOpen) {
			hasCompletedRef.current = false;
			reset();
		}
	}, [isOpen, reset]);

	useEffect(() => {
		if (!isRunning || hasCompletedRef.current) return;

		intervalRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!);
					clearInterval(quoteRef.current!);

					if (!hasCompletedRef.current) {
						hasCompletedRef.current = true;
						play();
						toast.success("Pomodoro completed! Task marked as done.");
						onFinish();
						setIsRunning(false);
						setIsOpen(false);
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		quoteRef.current = setInterval(() => {
			setQuoteIndex((i) => (i + 1) % QUOTES.length);
		}, 60000);

		return () => {
			clearInterval(intervalRef.current!);
			clearInterval(quoteRef.current!);
		};
	}, [isRunning, play, onFinish]);

	const handleDurationChange = (val: string) => {
		const mins = Math.max(1, Math.min(60, parseInt(val) || 25));
		setDuration(mins);
		setTimeLeft(mins * 60);
	};

	return (
		<div
			/* Ignore task item context menu here */
			onContextMenu={(e) => {
				e.preventDefault();
			}}
		>
			<Modal open={isOpen} onOpenChange={setIsOpen}>
				<ModalTrigger asChild>{children}</ModalTrigger>
				<ModalContent className="sm:max-w-xl">
					<ModalHeader>
						<ModalTitle>{title}</ModalTitle>
						<ModalDescription>
							Focus for
							<span className="ml-1 font-semibold text-primary">
								{formatTime(duration * 60)}
							</span>
						</ModalDescription>
					</ModalHeader>

					<div className="flex flex-col items-center gap-4 py-2">
						<AnimatedCircularProgressBar
							value={timeLeft}
							max={duration * 60}
							min={0}
							className="size-40"
							reverse
							gaugePrimaryColor="var(--primary)"
							gaugeSecondaryColor="var(--muted)"
						>
							<motion.span
								animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
								transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
								className="text-2xl"
							>
								{formatTime(timeLeft)}
							</motion.span>
						</AnimatedCircularProgressBar>

						<AnimatePresence mode="wait">
							<motion.div
								key={quoteIndex}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.5 }}
								className="h-12 space-y-0.5 text-center"
							>
								<p className="text-muted-foreground text-sm italic">
									"{QUOTES[quoteIndex].text}"
								</p>
								<p className="text-muted-foreground/60 text-xs">
									– {QUOTES[quoteIndex].author}
								</p>
							</motion.div>
						</AnimatePresence>

						<div className="grid w-full grid-cols-3 items-end gap-2">
							<div className="space-y-2">
								<Label htmlFor="duration" className="flex items-center text-sm">
									<IconRenderer name="Timer" className="text-primary/60" />
									Duration
									<span className="font-normal text-muted-foreground text-xs">
										(minutes)
									</span>
								</Label>
								<Input
									id="duration"
									type="number"
									value={duration}
									onChange={(e) => handleDurationChange(e.target.value)}
									min={1}
									max={60}
									disabled={isRunning}
								/>
							</div>

							<Button
								variant="outline"
								className="w-full"
								onClick={() => setIsRunning((r) => !r)}
							>
								{isRunning ? (
									<IconRenderer name="Pause" />
								) : (
									<IconRenderer name="Play" />
								)}
							</Button>

							<Button
								variant="outline"
								className="w-full"
								onClick={() => setMuted((m) => !m)}
							>
								{muted ? (
									<IconRenderer name="VolumeX" />
								) : (
									<IconRenderer name="Volume2" />
								)}
							</Button>
						</div>
					</div>
				</ModalContent>
			</Modal>
		</div>
	);
}
