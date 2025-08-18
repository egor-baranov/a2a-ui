"use client";

import { cn } from "@/utils/cn";
import { motion, type Transition } from "motion/react";
import type { CSSProperties } from "react";

type BorderTrailProps = {
	className?: string;
	size?: number;
	transition?: Transition;
	delay?: number;
	onAnimationCompleteAction?: () => void; // ✅ renamed for Next.js
	style?: CSSProperties;
};

export function BorderTrail({
															className,
															size = 100,
															transition,
															delay,
															onAnimationCompleteAction,
															style,
														}: BorderTrailProps) {
	const BASE_TRANSITION: Transition = {
		repeat: Number.POSITIVE_INFINITY,
		duration: 5,
		ease: "linear",
	};

	return (
		<div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
			<motion.div
				className={cn("absolute aspect-square bg-linear-to-r from-[#F788D7] to-[#FAF59F]", className)}
				style={{
					width: size,
					offsetPath: `rect(0 auto auto 0 round ${size}px)`,
					...style,
				}}
				animate={{
					offsetDistance: ["0%", "100%"],
				}}
				transition={{
					...(transition ?? BASE_TRANSITION),
					...(delay !== undefined ? { delay } : {}), // ✅ safe spreading
				}}
				onAnimationComplete={onAnimationCompleteAction} // ✅ works with Next.js
			/>
		</div>
	);
}
