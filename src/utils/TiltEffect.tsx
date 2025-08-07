import React, { useState, useCallback, ReactNode, MouseEvent } from "react";

function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let lastCall = 0;
	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall < delay) return;
		lastCall = now;
		func(...args);
	};
}

interface TiltEffectProps {
	children: ReactNode;
}

export const TiltEffect: React.FC<TiltEffectProps> = ({ children }) => {
	const [rotate, setRotate] = useState({ x: 0, y: 0 });

	const onMouseMove = useCallback(
		throttle((e: MouseEvent<HTMLDivElement>) => {
			const card = e.currentTarget;
			const { left, top, width, height } = card.getBoundingClientRect();
			const x = e.clientX - left;
			const y = e.clientY - top;
			const centerX = width / 2;
			const centerY = height / 2;
			const rotateX = (y - centerY) / 6;
			const rotateY = (centerX - x) / 6;

			setRotate({ x: rotateX, y: rotateY });
		}, 100),
		[]
	);

	const onMouseLeave = () => {
		setRotate({ x: 0, y: 0 });
	};

	return (
		<div
			className="card relative h-auto w-auto  rounded-xl bg-white transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			style={{
				transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
				transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
			}}
		>
			{children}
		</div>
	);
};
