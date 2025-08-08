import React, { useEffect, useState } from "react";

// BillingToggle.tsx
// A small, accessible, animated rounded toggle for "Monthly / Annually".
// - Tailwind CSS (no external helpers required)
// - Shadcn-friendly (uses Tailwind tokens you can easily swap to `bg-primary` etc.)
// - Keyboard + screen-reader friendly
// Usage:
// <BillingToggle defaultValue="monthly" onChange={(v) => console.log(v)} />

type BillingMode = "monthly" | "annually";

interface BillingToggleProps {
	defaultValue?: BillingMode;
	onChange?: (value: BillingMode) => void;
	ariaLabel?: string;
	// optional class to size / position the control
	className?: string;
}

export default function BillingToggle({
																				defaultValue = "monthly",
																				onChange,
																				ariaLabel = "Billing frequency",
																				className = "w-[180px] h-10 cursor-pointer",
																			}: BillingToggleProps) {
	const [mode, setMode] = useState<BillingMode>(defaultValue);

	useEffect(() => {
		setMode(defaultValue);
	}, [defaultValue]);

	function toggle() {
		const next: BillingMode = mode === "monthly" ? "annually" : "monthly";
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
			if (mode !== "monthly") setMode("monthly");
		}
		if (e.key === "ArrowRight") {
			e.preventDefault();
			if (mode !== "annually") setMode("annually");
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
				aria-checked={mode === "annually"}
				aria-label={ariaLabel}
				onClick={toggle}
				onKeyDown={onKeyDown}
				className={`relative w-full h-full rounded-full flex items-center bg-slate-200/70 dark:bg-slate-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 cursor-pointer`}
			>
				{/* sliding thumb (absolute) */}
				<span
					aria-hidden
					className={`absolute left-1 top-1 bottom-1 w-[84px] rounded-full shadow transition-transform duration-300 ease-out ${
						mode === "annually" ? "translate-x-22" : "translate-x-0"
					} bg-black`}
					style={{ willChange: "transform" }}
				/>

				{/* labels */}
				<span className="relative z-10 w-1/2 text-center text-md font-medium">
          <span
						className={`inline-block w-full transition-colors duration-200 ${
							mode === "monthly" ? "text-white" : "text-slate-700 dark:text-slate-200"
						}`}
					>
            Monthly
          </span>
        </span>

				<span className="relative z-10 w-1/2 text-center text-md font-medium">
          <span
						className={`inline-block w-full transition-colors duration-200 ${
							mode === "annually" ? "text-white" : "text-slate-700 dark:text-slate-200"
						}`}
					>
            Annually
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
