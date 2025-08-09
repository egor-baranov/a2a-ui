import React from "react";

interface HamburgerProps {
	isOpen: boolean;
	onClick: () => void;
	className?: string;
	ariaLabel?: string;
	/** Tailwind class for the bar color, e.g. 'bg-gray-800' or 'bg-white' */
	barColorClass?: string;
}

const Hamburger: React.FC<HamburgerProps> = ({
																							 isOpen,
																							 onClick,
																							 className = "",
																							 ariaLabel = "Toggle menu",
																							 barColorClass = "bg-gray-800",
																						 }) => {
	const baseBarClasses = `${barColorClass} block h-0.5 w-6 rounded-sm transform transition-all duration-300 ease-out`;

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel}
			aria-expanded={isOpen}
			className={`flex flex-col justify-center items-center ${className} focus:outline-none`}
		>
      <span
				className={`${baseBarClasses} ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
			/>
			<span
				className={`${baseBarClasses} my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
			/>
			<span
				className={`${baseBarClasses} ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
			/>
		</button>
	);
};

export default Hamburger;
