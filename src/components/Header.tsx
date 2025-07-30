"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SparklesIcon, MenuIcon, XIcon } from "lucide-react";

const navItems = [
	{ label: "Create", href: "/create" },
	{ label: "Explore", href: "/explore" },
	{ label: "Login",   href: "/login" },
];

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	return (
		<header className="bg-white border-b p-4 flex items-center justify-between md:justify-start md:gap-8">
			{/* Logo */}
			<div
				className="flex items-center gap-2 pl-2 cursor-pointer"
				onClick={() => router.push("/")}
			>
				<SparklesIcon className="w-5 h-5 text-primary" />
				<span className="text-xl font-bold">svgen.io</span>
			</div>

			{/* Desktop Nav */}
			<nav className="hidden md:flex gap-2 ml-auto pr-4">
				{navItems.map(({ label, href }) => (
					<Link key={href} href={href} passHref>
						<Button
							variant={pathname === href ? "default" : "ghost"}
							className="cursor-pointer"
						>
							{label}
						</Button>
					</Link>
				))}
			</nav>

			{/* Mobile Menu Button */}
			<button
				className="md:hidden p-2 ml-auto"
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
			</button>

			{/* Mobile Nav */}
			{mobileMenuOpen && (
				<div className="absolute top-16 left-0 w-full bg-white border-t shadow-md flex flex-col z-50 md:hidden">
					{navItems.map(({ label, href }) => (
						<Link key={href} href={href} passHref>
							<Button
								variant={pathname === href ? "default" : "ghost"}
								className="w-full justify-start"
								onClick={() => setMobileMenuOpen(false)}
							>
								{label}
							</Button>
						</Link>
					))}
				</div>
			)}
		</header>
	);
}
