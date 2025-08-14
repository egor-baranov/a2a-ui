import React, { useEffect, useState } from "react";

// BillingToggle.tsx
// A small, accessible, animated rounded toggle for "icon / illustration".
// - Tailwind CSS (no external helpers required)
// - Shadcn-friendly (uses Tailwind tokens you can easily swap to `bg-primary` etc.)
// - Keyboard + screen-reader friendly
// Usage:
// <BillingToggle defaultValue="icon" onChange={(v) => console.log(v)} />

type StyleMode = "illustration" | "icon";

interface BillingToggleProps {
	defaultValue?: StyleMode;
	onChange?: (value: StyleMode) => void;
	ariaLabel?: string;
	// optional class to size / position the control
	className?: string;
}

export default function StyleToggle({
																				defaultValue = "icon",
																				onChange,
																				ariaLabel = "Billing frequency",
																				className = "w-full h-8 cursor-pointer",
																			}: BillingToggleProps) {
	const [mode, setMode] = useState<StyleMode>(defaultValue);

	useEffect(() => {
		setMode(defaultValue);
	}, [defaultValue]);

	function toggle() {
		const next: StyleMode = mode === "icon" ? "illustration" : "icon";
		setMode(next);
		onChange?.(next);
	}

	function onKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggle();
		}
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			if (mode !== "icon") setMode("icon");
		}
		if (e.key === "ArrowRight") {
			e.preventDefault();
			if (mode !== "illustration") setMode("illustration");
		}
	}

	return (
		<div
			className={`relative inline-block ${className} select-none`}
		>
			{/* clickable element with switch semantics */}
			<button
				type="button"
				role="switch"
				aria-checked={mode === "illustration"}
				aria-label={ariaLabel}
				onClick={toggle}
				onKeyDown={onKeyDown}
				className={`relative w-full h-full rounded-full flex items-center border-1 bg-white/20 backdrop-blur dark:bg-slate-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 cursor-pointer`}
			>
				{/* sliding thumb (absolute) */}
				<span
					aria-hidden
					className={`absolute left-1 top-1 bottom-1 w-1/2 rounded-full shadow transition-transform duration-300 ease-out ${
						mode === "illustration" ? "translate-x-30.5" : "translate-x-0"
					} bg-black`}
					style={{ willChange: "transform" }}
				/>

				{/* labels */}
				<span className="relative z-10 w-1/2 text-center text-md font-medium">
          <span
						className={`inline-block w-full transition-colors duration-200 ${
							mode === "icon" ? "text-white" : "text-slate-700 dark:text-slate-200"
						}`}
					>
            icon
          </span>
        </span>

				<span className="relative z-10 w-1/2 text-center text-md font-medium">
          <span
						className={`inline-block w-full transition-colors duration-200 ${
							mode === "illustration" ? "text-white" : "text-slate-700 dark:text-slate-200"
						}`}
					>
            illustration
          </span>
        </span>
			</button>

			{/* visually-hidden input for forms if needed (optional) */}
			<input
				readOnly
				value={mode}
				name="billing_frequency"
				className="sr-only"
				aria-hidden
			/>
		</div>
	);
}
